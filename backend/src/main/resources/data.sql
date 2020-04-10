-- Temporary create some Dummy data to test the mapper
INSERT INTO Player
VALUES (1, 'Michael Jordan', parseDateTime('19630217000000','yyyyMMddHHmmss'), 'F-G', '6.6', 216, NULL);

INSERT INTO Player
VALUES (2, 'Kobe Bryant', parseDateTime('19780823000000','yyyyMMddHHmmss'), 'F-G', '6.6', 212, NULL);

INSERT INTO Player
VALUES (3, 'LeBron James', parseDateTime('19841230000000','yyyyMMddHHmmss'), 'G-F', '6.9', 250, NULL);

INSERT INTO Player
VALUES (4, 'Stephen Curry', parseDateTime('198803140000000','yyyyMMddHHmmss'), 'G', '6.3', 190, NULL);

INSERT INTO Player
VALUES (5, 'Kevin Durant', parseDateTime('19630217000000','yyyyMMddHHmmss'), 'F', '6.10', 240, NULL);

INSERT INTO Franchise
VALUES (1, 'GSW', 'Warriors', 1946, 'Golden State', 'Chase Center');

INSERT INTO Franchise
VALUES (2, 'LAL', 'Lakers', 1948, 'Los Angeles', 'Staples Center');
