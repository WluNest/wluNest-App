CREATE DATABASE wluNest;
USE wluNest;

# Creates the users table
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY UNIQUE auto_increment,
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
    listing_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_admin BOOLEAN DEFAULT FALSE,
    listing_image VARCHAR(255) NOT NULL,
    bed INT NOT NULL,
    bath INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

#Creates the review table
CREATE TABLE review(
    review_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
);

#Creates the property table
CREATE TABLE property
(
    property_id   SERIAL PRIMARY KEY UNIQUE auto_increment,
    listing_id    INT          NOT NULL,
    unit_number   VARCHAR(255) NULL,
    street_name   VARCHAR(255) NOT NULL,
    street_number VARCHAR(255) NOT NULL,
    city          VARCHAR(255) NOT NULL,
    province      VARCHAR(255) NOT NULL,
    postal_code   VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
);

#Creates the floor_plan table
CREATE TABLE floor_plan
(
    floor_plan_id    SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id      INT          NOT NULL,
    floor_plan_name  VARCHAR(255) NOT NULL,
    floor_plan_image VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property (property_id)
);

#Creates the amentites
CREATE TABLE amentites (
    amentites_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    amentites_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id)
    );


#juntions tables 

#Connects the property and amentites table to save the amentites to a specific property
CREATE TABLE property_amenities
(
    property_amenities_id INT UNIQUE,
    property_id INT NOT NULL,
    amentites_id    INT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property (property_id) ON DELETE CASCADE,
    FOREIGN KEY (amentites_id) REFERENCES amentites (amentites_id) ON DELETE CASCADE
);

#Connects the user and listing table to save users favorite listings
CREATE TABLE user_saves
(
    user_saves_id INT UNIQUE,
    user_id INT NOT NULL,
    listing_id  INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id) ON DELETE CASCADE
);

#Connects the user and review table to show users reviews
CREATE TABLE user_reviews
(
    user_reviews_id INT UNIQUE,
    user_id INT NOT NULL,
    review_id   INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES review (review_id) ON DELETE CASCADE
);

#Connects the user and listing tables to show users listings
CREATE TABLE user_listings
(
    user_listings_id INT UNIQUE,
    user_id INT NOT NULL,
    listing_id  INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (listing_id) REFERENCES listings (listing_id)
);

