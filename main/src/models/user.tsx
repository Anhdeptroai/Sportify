export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    // followees_count: number;
    subscription_type: string | null;
    profile_picture: string | null;
    followees_count: number;
}

// Type for user registration request
export interface UserRegistrationRequest {
    username: string;
    email: string;
    password: string;
}

// Type for user registration response
export interface UserRegistrationResponse {
    user: User;
    token?: string;
}

// Type for user login request
export interface UserLoginRequest {
    email: string;
    password: string;
}

// Type for user login response
export interface UserLoginResponse {
    user: User;
    token: string;
}

// Type for user profile update
export interface UserProfileUpdate {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    subscription_type?: string;
} 