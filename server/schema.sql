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

CREATE TABLE review{
    review_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
}

CREATE TABLE property {
    property_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    listing_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
}

CREATE TABLE floor_plan {
    floor_plan_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    floor_plan_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES property(property_id)
}

CREATE TABLE amentites {
    amentites_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    amentites_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES property(property_id)
}
CREATE TABLE propertyamenities {
    propertyamenities_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    amentites_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES property(property_id),
    FOREIGN KEY (amentites_id) REFERENCES amentites(amentites_id)
}