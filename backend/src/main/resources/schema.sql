DROP TABLE Player IF EXISTS;

CREATE TABLE `Player` (
  `ID` INT PRIMARY KEY,
  `Name` VARCHAR(50) NOT NULL,
  `BirthDate` DATE NOT NULL,
  `Position` ENUM('C','C-F','F','F-C','F-G','G','G-F') NOT NULL,
  `Height` VARCHAR(10) NOT NULL,
  `Weight` INT NOT NULL,
  `College` INT
);

DROP TABLE User IF EXISTS;

CREATE TABLE `User` (
    `Username` VARCHAR(50) PRIMARY KEY,
    `Email` VARCHAR(75) NOT NULL,
    `Password` VARCHAR(150) NOT NULL,
);

DROP TABLE FavoritesPlayer IF EXISTS;

CREATE TABLE `FavoritesPlayer` (
    `Player` INT NOT NULL,
    `Username` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`Player`, `Username`)
);