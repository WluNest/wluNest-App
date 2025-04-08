USE wluNest;


INSERT INTO users (
    username, first_name, last_name, password, email,
    religion, gender, university, year, program, about_you
)
VALUES (
    'Aryaman', 'Aryaman', 'Doe', 'hashed_password', 'Aryaman@example.com',
    'None', 'Male', 'Wilfrid Laurier University', 2025, 'Computer Science', 'Just a test user.'
);


SET @user_id = LAST_INSERT_ID();


INSERT INTO listings (
    users_id, unit_number, title, description, price, bed, bath,
    url, listing_image, created_by_admin,
    has_laundry, has_parking, has_gym, has_hvac, has_wifi,
    has_game_room, is_pet_friendly, is_accessible
)
VALUES (
    @user_id, 'Unit 205', 'Modern 2 Bedroom Apartment',
    'Spacious and bright 2-bedroom apartment near campus. Includes full amenities.',
    1650.00, 2, 1,
    'https://www.accommod8u.com/student-housing?lang=ko&gad_source=1&gclid=Cj0KCQjw16O_BhDNARIsAC3i2GDYhQGVTvz7rSgJmPbDw4Z6-s1wCKpyplUFmFEUt35LgSxylAweOBIaAvf3EALw_wcB',
    'images/listings/NEW', 0,
    TRUE, TRUE, FALSE, TRUE, TRUE,
    FALSE, TRUE, FALSE
);


SET @listing_id = LAST_INSERT_ID();


UPDATE listings SET listing_image = CONCAT('images/listings/', @listing_id) WHERE listing_id = @listing_id;

INSERT INTO property (
    listing_id, street_name, street_number, city,
    province, postal_code, latitude, longitude
)
VALUES (
    @listing_id, 'King Street', '123', 'Waterloo',
    'Ontario', 'N2L 3T8', 43.4723, -80.5449
);


INSERT INTO users_saves (users_id, listing_id)
VALUES (@user_id, @listing_id);


INSERT INTO review (users_id, listing_id, rating, description)
VALUES (@user_id, @listing_id, 5, 'Amazing listing! Clean and very close to campus.');


SET @review_id = LAST_INSERT_ID();

INSERT INTO users_reviews (users_id, review_id)
VALUES (@user_id, @review_id);

INSERT INTO users_listings (users_id, listing_id)
VALUES (@user_id, @listing_id);
