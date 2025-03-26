-- Sample population script for wluNest database
USE wluNest;

INSERT INTO users (username, first_name, last_name, password, email, role)
VALUES
('user1', 'Johnny', 'Hohn', 'passwordpass', 'john@gmail.com', 'user'),
('user2', 'Arya', 'Singh', 'aryaspassword', 'arya@gmail.com', 'user'),
('user3', 'Aaron', 'Kim', 'aaronspass', 'aaron@wlunest.com', 'admin');

INSERT INTO listings (users_id, unit_number, title, description, price, listing_image, bed, bath)
VALUES
(1, '302', '1 Bedroom Apartment', 'Cozy apartment close to university.', 1200.00, 'listing1.jpg',1, 1),
(1, '102', '2 Bedroom House', 'Spacious house with backyard.', 2200.00,'listing1.jpg', 2, 2),
(2, '102', 'Studio Near Campus', 'Spacious Studio', 800.00, 'listing1.jpg', 0, 1);

INSERT INTO property (listing_id, street_name, street_number, city, province, postal_code)
VALUES
(1, 'King Street North', '167', 'Waterloo','ON','N2J 0B6'),
(2, 'Albert Street', '202', 'Waterloo','ON','N2L 0B6');

INSERT INTO floor_plan (property_id, floor_plan_name, floor_plan_image)
VALUES
(1, 'Standard One Bedroom', 'floor_plan1.jpg'),
(2, 'Deluxe Suite', 'floorplan2.jpg');

INSERT INTO amenities (property_id, amenities_name)
VALUES
(1, 'Gym'),
(1, 'Laundry Room'),
(2, 'Pool'),
(2, 'Parking Garage');
INSERT INTO property (listing_id, street_name, street_number, city, province, postal_code, latitude, longitude)
VALUES
(1, 'King Street North', '167', 'Waterloo','ON','N2J 0B6', 43.475503, -80.528091),
(2, 'Albert Street', '202', 'Waterloo','ON','N2L 0B6', 43.474610, -80.531839);

INSERT INTO property_amenities (property_id, amenities_id)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4);

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
