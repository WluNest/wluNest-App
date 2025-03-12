CREATE DATABASE wluNest;
USE wluNest;

CREATE TABLE users{
    user_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    username VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    role ENUM('admin', 'user') DEFAULT 'user'

};

CREATE TABLE listings{
    listing_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
};