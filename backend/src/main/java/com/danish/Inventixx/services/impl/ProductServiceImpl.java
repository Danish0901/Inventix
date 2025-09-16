package com.danish.Inventixx.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.danish.Inventixx.dtos.ProductDTO;
import com.danish.Inventixx.dtos.Response;
import com.danish.Inventixx.exceptions.NotFoundException;
import com.danish.Inventixx.models.Category;
import com.danish.Inventixx.models.Product;
import com.danish.Inventixx.repositories.CategoryRepository;
import com.danish.Inventixx.repositories.ProductRepository;
import com.danish.Inventixx.services.ProductService;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;
    private final S3Client s3Client;

     @Value("${aws.bucket.name}")
    private String bucketName;

    @Override
    public Response saveProduct(ProductDTO productDTO, MultipartFile imageFile) {

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category Not Found"));

        Product productToSave = Product.builder()
                .name(productDTO.getName())
                .sku(productDTO.getSku())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .description(productDTO.getDescription())
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            log.info("Image file exist");
            String imagePath = saveImage(imageFile); 

            System.out.println("IMAGE URL IS: " + imagePath);
            productToSave.setImageUrl(imagePath);
        }

        productRepository.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product successfully saved")
                .build();
    }

    @Override
    public Response updateProduct(ProductDTO productDTO, MultipartFile imageFile) {

        Product existingProduct = productRepository.findById(productDTO.getProductId())
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = saveImage(imageFile); 
            System.out.println("IMAGE URL IS: " + imagePath);
            existingProduct.setImageUrl(imagePath);
        }

        if (productDTO.getCategoryId() != null && productDTO.getCategoryId() > 0) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category Not Found"));
            existingProduct.setCategory(category);
        }

        if (productDTO.getName() != null && !productDTO.getName().isBlank()) {
            existingProduct.setName(productDTO.getName());
        }

        if (productDTO.getSku() != null && !productDTO.getSku().isBlank()) {
            existingProduct.setSku(productDTO.getSku());
        }

        if (productDTO.getDescription() != null && !productDTO.getDescription().isBlank()) {
            existingProduct.setDescription(productDTO.getDescription());
        }

        if (productDTO.getPrice() != null && productDTO.getPrice().compareTo(BigDecimal.ZERO) >= 0) {
            existingProduct.setPrice(productDTO.getPrice());
        }

        if (productDTO.getStockQuantity() != null && productDTO.getStockQuantity() >= 0) {
            existingProduct.setStockQuantity(productDTO.getStockQuantity());
        }
        productRepository.save(existingProduct);

        return Response.builder()
                .status(200)
                .message("Product Updated successfully")
                .build();


    }

    @Override
    public Response getAllProducts() {

        List<Product> productList = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        List<ProductDTO> productDTOList = modelMapper.map(productList, new TypeToken<List<ProductDTO>>() {
        }.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .products(productDTOList)
                .build();
    }

    @Override
    public Response getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));

        return Response.builder()
                .status(200)
                .message("success")
                .product(modelMapper.map(product, ProductDTO.class))
                .build();
    }

    @Override
public Response deleteProduct(Long id) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Product Not Found"));

    if (product.getImageUrl() != null && !product.getImageUrl().isBlank()) {
        try {
            s3Client.deleteObject(b -> b
                    .bucket(bucketName)
                    .key(product.getImageUrl()) 
            );
            log.info("Deleted image from S3: {}", product.getImageUrl());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete image from S3: " + e.getMessage(), e);
        }
    }

    productRepository.deleteById(id);

    return Response.builder()
            .status(200)
            .message("Product Deleted successfully")
            .build();
}

    @Override
    public Response searchProduct(String input) {

        List<Product> products = productRepository.findByNameContainingOrDescriptionContaining(input, input);

        if (products.isEmpty()) {
            throw new NotFoundException("Product Not Found");
        }

        List<ProductDTO> productDTOList = modelMapper.map(products, new TypeToken<List<ProductDTO>>() {
        }.getType());

        return Response.builder()
                .status(200)
                .message("success")
                .products(productDTOList)
                .build();
    }

    private String saveImage(MultipartFile imageFile) {
        if (!imageFile.getContentType().startsWith("image/") || imageFile.getSize() > 1024 * 1024 * 1024) {
            throw new IllegalArgumentException("Only image files under 1GB are allowed");
        }

        String originalName = imageFile.getOriginalFilename().replaceAll(" ", "_").replaceAll("[()]", "");
        String uniqueFileName = UUID.randomUUID() + "_" + originalName;


        try {
            s3Client.putObject(
                 PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(uniqueFileName)
                    .contentType(imageFile.getContentType())
                    .build(),
                RequestBody.fromInputStream(imageFile.getInputStream(), imageFile.getSize())
            );
        } catch (Exception e) {
            throw new IllegalArgumentException("Error saving Image to S3: " + e.getMessage());
    }

        return uniqueFileName;
}

}
