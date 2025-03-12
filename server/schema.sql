CREATE DATABASE wluNest;
USE wluNest;

# Creates the users table
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
#Creates the listings table
CREATE TABLE listings{
    listing_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
};

#Creates the review table
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

#Creates the property table
CREATE TABLE property {
    property_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    listing_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
}

#Creates the floor_plan table
CREATE TABLE floor_plan {
    floor_plan_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    floor_plan_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id)
}

#Creates the amentites
CREATE TABLE amentites {
    amentites_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    amentites_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id)
}


#juntions tables 

#Connects the property and amentites table to save the amentites to a specific property
CREATE TABLE property_amenities {
    property_amenities_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    amentites_id INT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id),
    FOREIGN KEY (amentites_id) REFERENCES amentites(amentites_id)
}

#Connects the property and floor_plan table to save the floor plans to a specific property
CREATE TABLE property_floorplan {
    property_floorplan_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    property_id INT NOT NULL,
    floor_plan_id INT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES property(property_id),
    FOREIGN KEY (floor_plan_id) REFERENCES floor_plan(floor_plan_id)
}

#Connects the user and listing table to save users favorite listings

CREATE TABLE user_saves {
    user_saves_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
}

#Connects the user and review table to show users reviews
CREATE TABLE user_reviews {
    user_reviews_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    review_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (review_id) REFERENCES review(review_id)
}

#Connects the user and listing tables to show users listings
CREATE TABLE user_listings {
    user_listings_id SERIAL PRIMARY KEY UNIQUE auto_increment,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id)
}

