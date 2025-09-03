package com.danish.Inventixx.services;

import com.danish.Inventixx.dtos.LoginRequest;
import com.danish.Inventixx.dtos.RegisterRequest;
import com.danish.Inventixx.dtos.Response;
import com.danish.Inventixx.dtos.UserDTO;
import com.danish.Inventixx.models.User;

public interface UserService {
    Response registerUser(RegisterRequest registerRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getCurrentLoggedInUser();

    Response getUserById(Long id);

    Response updateUser(Long id, UserDTO userDTO);

    Response deleteUser(Long id);

    Response getUserTransactions(Long id);
}
