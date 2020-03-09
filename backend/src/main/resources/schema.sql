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