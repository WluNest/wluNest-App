-- Sample population script for wluNest database
USE wluNest;

INSERT INTO users (username, first_name, last_name, password, email, role)
VALUES
('user1', 'Johnny', 'Hohn', 'passwordpass', 'john@gmail.com', 'user'),
('user2', 'Arya', 'Singh', 'aryaspassword', 'arya@gmail.com', 'user'),
('user3', 'Aaron', 'Kim', 'aaronspass', 'aaron@wlunest.com', 'admin');

INSERT INTO listings (users_id, unit_number, title, description, price, listing_image, bed, bath, url, has_laundry, has_parking, has_gym, has_hvac, has_wifi, has_game_room, is_pet_friendly, is_accessible)
VALUES
(1, '302', '1 Bedroom Apartment', 'Cozy apartment close to university.', 1200.00, 'listing1.jpg',1, 1,'https://rentals.ca/waterloo/the-marq-waterloo-at-1-columbia-st-w',1,1,1,1,1,1,1,1),
(1, '102', '2 Bedroom Apartment', 'Spacious apartment close to Wilfrid Laurier University.', 2200.00,'listing2.jpg', 2, 2,'https://rentals.ca/waterloo/vogue-residences',1,1,1,1,1,1,1,1),
(2, '102', 'Studio Near Campus', 'Spacious Studio', 800.00, 'listing3.jpg', 0, 1,'https://www.apartments-waterloo-228albert.com/?rcstdid=MzI%3d-GJOvflXLv8M%3d&_yTrackUser=MzM1MTE2OTA2MiMxMzM2NzAxMDE0-FtXlJwAd8xM%3d',1,1,1,1,1,1,1,1);


INSERT INTO property (listing_id, street_name, street_number, city, province, postal_code, latitude, longitude)
VALUES
(1, 'Columbia Street West', '1', 'Waterloo','ON','N2L 0C8', 43.48164, -80.52640),
(2, 'King Street North', '155', 'Waterloo','ON','N2J 0EB', 43.47150, -80.52431),
(3, 'King Street North', '158', 'Waterloo', 'ON', 'N2J 0E5', 43.47183, -80.52375);


INSERT INTO review (users_id, listing_id, rating, description)
VALUES
(1, 1, 4, 'Very nice apartment, close to campus.'),
(2, 2, 5, 'Loved the spacious rooms!');

INSERT INTO users_saves (users_id, listing_id)
VALUES
(1, 2),
(2, 1);

INSERT INTO users_listings (users_id, listing_id)
VALUES
(1, 1),
(2, 2);
