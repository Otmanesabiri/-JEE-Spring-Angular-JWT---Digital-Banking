export interface User {
    username: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    confirmedPassword: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    username: string;
    roles: string[];
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
