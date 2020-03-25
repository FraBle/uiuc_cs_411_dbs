CREATE TABLE `Franchise` (
  `ID` int(11) NOT NULL,
  `Abbreviation` varchar(10) NOT NULL,
  `Nickname` varchar(100) NOT NULL,
  `YearFounded` year(4) NOT NULL,
  `City` varchar(100) NOT NULL,
  `Arena` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOAD DATA LOCAL INFILE './Franchise.csv' 
  INTO TABLE Franchise 
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;