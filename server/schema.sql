CREATE DATABASE wluNest;
USE wluNest;

# Creates the users table
CREATE TABLE users(
    users_id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    username VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('admin', 'user') DEFAULT 'user'
);
#Creates the listings table
CREATE TABLE listings(
    listing_id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    users_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_admin BOOLEAN DEFAULT FALSE,
    listing_image VARCHAR(255) NOT NULL,
    bed INT NOT NULL,
    bath INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(users_id) ON DELETE CASCADE
);

#Creates the review table
CREATE TABLE review(
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users(users_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    UNIQUE(users_id, listing_id) #Ensures one user can only review a listing once.
);

#Creates the property table
CREATE TABLE property
(
    property_id   INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    listing_id    INT          NOT NULL,
    unit_number   VARCHAR(255) NULL,
    street_name   VARCHAR(255) NOT NULL,
    street_number VARCHAR(255) NOT NULL,
    city          VARCHAR(255) NOT NULL,
    province      VARCHAR(255) NOT NULL,
    postal_code   VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id) ON DELETE CASCADE
);

#Creates the floor_plan table
CREATE TABLE floor_plan
(
    floor_plan_id    INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    property_id      INT          NOT NULL,
    floor_plan_name  VARCHAR(255) NOT NULL,
    floor_plan_image VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property (property_id) ON DELETE CASCADE
);

#Creates the amenities
CREATE TABLE amenities (
    amenities_id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    property_id INT NOT NULL,
    amenities_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE
    );

#juntions tables 

#Connects the property and amenities table to save the amenities to a specific property
#(uses a composite primary key to prevent duplicates)
CREATE TABLE property_amenities
(
    property_id INT NOT NULL,
    amenities_id    INT NOT NULL,
    PRIMARY KEY (property_id, amenities_id),
    FOREIGN KEY (property_id) REFERENCES property (property_id) ON DELETE CASCADE,
    FOREIGN KEY (amenities_id) REFERENCES amenities (amenities_id) ON DELETE CASCADE
);

#Connects the user and listing table to save users favorite listings
# (Users can save multiple listings)
CREATE TABLE users_saves
(
    users_saves_id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT NOT NULL,
    listing_id  INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id) ON DELETE CASCADE
);

#Connects the user and review table to show users reviews
#(Users can create multiple reviews)
CREATE TABLE users_reviews
(
    users_reviews_id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    users_id INT NOT NULL,
    review_id   INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES review (review_id) ON DELETE CASCADE
);

#Connects the user and listing tables to show users listings(Users can create multiple listings)
CREATE TABLE users_listings
(
    user_listings_id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT NOT NULL,
    listing_id  INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (users_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id) ON DELETE CASCADE
);

# Indexes for performance
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_listing_user_id ON listings(users_id);
CREATE INDEX idx_review_user_id ON review(users_id);
CREATE INDEX idx_review_listing_id ON review(listing_id);