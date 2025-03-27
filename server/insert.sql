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


INSERT INTO property (listing_id, street_name, street_number, city, province, postal_code, latitude, longitude)
VALUES
(1, 'Columbia Street West', '1', 'Waterloo','ON','N2L 0C8', 43.48164, -80.52640),
(2, 'King Street North', '155', 'Waterloo','ON','N2J 0EB', 43.47150, -80.52431),
(3, 'King Street North', '158', 'Waterloo', 'ON', 'N2J 0E5', 43.47183, -80.52375),
(4, 'Regina Street North', '328', 'Waterloo', 'ON', 'N2J 3A5', 43.48001, -80.52419),
(5, 'Phillip Street', '252', 'Waterloo', 'ON', 'N2L 0E1', 43.47374, -80.53566),
(6, 'Phillip Street', '254', 'Waterloo', 'ON', 'N2L 0E1', 43.47391, -80.53647),
(7, 'Phillip Street,' , '256','Waterloo', 'ON', 'N2L 6B6', 43.47374, -80.53703),
(8, 'Larch Street', '275', 'Waterloo', 'ON','N2L 0J5', 43.47637, -80.53103),
(9, 'King Street North', '333', 'Waterloo', 'ON', 'N2J 2Z1', 43.47985, -80.52608),
(10, 'King Street North', '308', 'Waterloo', 'ON', 'N2J 0G4', 43.47884, -80.52518),
(11, 'Lester Street', '203', 'Waterloo', 'ON', 'N2L 0B5', 43.47239, -80.53362),
(12, 'Hemlock Street', '251', 'Waterloo', 'ON', 'N2L 0H2', 43.47514, -80.53162),
(13, 'Columbia Street West', '145', 'Waterloo', 'ON', 'N2L 0K7', 43.47730, -80.53874),
(14, 'Lester Street', '181', 'Waterloo', 'ON', 'N2L 0C2', 43.47148, -80.53251),
(15, 'Phillip Street', '250', 'Waterloo', 'ON', 'N2L 3E9', 43.47332, -80.53660);

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
