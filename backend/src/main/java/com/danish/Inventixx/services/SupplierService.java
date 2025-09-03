package com.danish.Inventixx.services;

import com.danish.Inventixx.dtos.Response;
import com.danish.Inventixx.dtos.SupplierDTO;

public interface SupplierService {

    Response addSupplier(SupplierDTO supplierDTO);

    Response updateSupplier(Long id, SupplierDTO supplierDTO);

    Response getAllSupplier();

    Response getSupplierById(Long id);

    Response deleteSupplier(Long id);

}
