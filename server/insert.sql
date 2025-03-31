USE wluNest;

-- Insert a sample user (required for foreign key)
INSERT INTO users (
    username, first_name, last_name, password, email,
    religion, gender, university, year, program, about_you
)
VALUES('Aryaman', 'Aryaman', 'Singh', 'hashed_password', 'Aryaman@example.com',
'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Computer Science student needing a place for winter.'),
('Paarth', 'Paarth', 'Bagga', 'hashed_password', 'paarth@gmail.com',
'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Student looking for a cleanly roomate.'),
('Otis', 'Otis', 'lau', 'hashed_password', 'otis@gmail.com',
'None', 'Male', 'Waterloo University', 2025, 'Computer Science', 'Computer Sceince student at Laurier looking for a roomate.'),
('George', 'George', 'Singh', 'hashed_password', 'george@gmail.com',
'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Athlete looking for accomodation in the fall.'),
('Matthew', 'Matthew', 'SMyers', 'hashed_password', 'matthew@gmail.com',
'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Looking for a spacious apartment to practice the flute.'),
('Aaron', 'Aaron', 'Kim', 'hashed_password', 'aaron@wlunest.com',
'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Student at Laurier looking for a place to stay for the summer');

-- Get the ID of the newly inserted user
SET @user_id = LAST_INSERT_ID();

-- Insert sample listing for that user
INSERT INTO listings (
    users_id, unit_number, title, description, price, bed, bath,
    url, listing_image, created_by_admin,
    has_laundry, has_parking, has_gym, has_hvac, has_wifi,
    has_game_room, is_pet_friendly, is_accessible
)
VALUES
    (@user_id, 'Unit 205', 'Modern 2 Bedroom Apartment',
    'Spacious and bright 2-bedroom apartment near campus. Includes full amenities.',
    1650.00, 2, 1,
    'https://www.accommod8u.com/student-housing?lang=ko&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GDYhQGVTvz7rSgJmPbDw4Z6-s1wCKpyplUFmFEUt35LgSxylAweOBIaAvf3EALw_wcB',
    'images/listings/NEW', 0,
    TRUE, TRUE, FALSE, TRUE, TRUE,
    FALSE, TRUE, FALSE),

    (@user_id, 'Unit 306', '2 Bedroom Apartment',
     'Nice cozy 2-bedroom apartment with a balcony. Includes amentities within the room.',
     2529.00,2,2,'https://www.vogueresidences.ca','images/listings/14/1', 0,
     TRUE, TRUE, TRUE,TRUE, TRUE,
     TRUE, TRUE, TRUE),

    (@user_id, 'Unit 101', '4 Bedroom Apartment', 'Nice 4-bedroom apartments with ensuite bathrooms.',
     1200.00, 4,4,'https://www.canadianstudentliving.com/properties/hespeler-house-2/', 'images/listings/15/1', 0,
     TRUE, TRUE, TRUE,TRUE, TRUE,
     TRUE, FALSE, FALSE);

-- Get the ID of the newly inserted listing
SET @listing_id = LAST_INSERT_ID();

-- Update listing image path to include listing ID
UPDATE listings SET listing_image = CONCAT('images/listings/', @listing_id) WHERE listing_id = @listing_id;

-- Insert corresponding property record
INSERT INTO property (
    listing_id, street_name, street_number, city,
    province, postal_code, latitude, longitude
)
VALUES (@listing_id, 'King Street', '123', 'Waterloo', 'Ontario', 'N2L 3T8', 43.4723, -80.5449),
       (@listing_id, 'Columbia Street', '1', 'Waterloo', 'Ontario', 'N2L 0C8', 43.48164, -80.52640),
       (@listing_id, 'Regina Street', '328', 'Waterloo', 'Ontario', 'N2J 3A5', 43.48001, -80.52419);
-- Optional: Save the listing as a favorite by the same user
INSERT INTO users_saves (users_id, listing_id)
VALUES (@user_id, @listing_id);

-- Optional: Add a review
INSERT INTO review (users_id, listing_id, rating, description)
VALUES (@user_id, @listing_id, 5, 'Amazing listing! Clean and very close to campus.');

-- Link the review for user profile aggregation
SET @review_id = LAST_INSERT_ID();

INSERT INTO users_reviews (users_id, review_id)
VALUES (@user_id, @review_id);

-- Link the listing to the user
INSERT INTO users_listings (users_id, listing_id)
VALUES (@user_id, @listing_id);
