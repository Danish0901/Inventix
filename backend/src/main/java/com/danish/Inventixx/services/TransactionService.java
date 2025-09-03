package com.danish.Inventixx.services;

import com.danish.Inventixx.dtos.Response;
import com.danish.Inventixx.dtos.TransactionRequest;
import com.danish.Inventixx.enums.TransactionStatus;

public interface TransactionService {
    Response purchase(TransactionRequest transactionRequest);

    Response sell(TransactionRequest transactionRequest);

    Response returnToSupplier(TransactionRequest transactionRequest);

    Response getAllTransactions(int page, int size, String filter);

    Response getAllTransactionById(Long id);

    Response getAllTransactionByMonthAndYear(int month, int year);

    Response updateTransactionStatus(Long transactionId, TransactionStatus status);
}
