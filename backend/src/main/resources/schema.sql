-- Temporary create the schema here for test purpose
DROP TABLE PLAYER IF EXISTS;

CREATE TABLE `PLAYER`(
    `id`          UUID PRIMARY KEY,
    `firstName`   VARCHAR(100) NOT NULL,
    `lastName`    VARCHAR(100) NOT NULL,
    `birthDate`   DATE,
    `position`    ENUM('PG', 'SG', 'SF', 'PF', 'C'),
    `height`      FLOAT,
    `weight`      FLOAT
);