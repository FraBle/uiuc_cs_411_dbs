CREATE TABLE `Games` (
  `ID` int(11) NOT NULL,
  `Season` year(4) NOT NULL,
  `HomeFranchise` int(11)  NOT NULL,
  `VisitorFranchise` int(11)  NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`HomeFranchise`) REFERENCES `Franchise` (`ID`),
  FOREIGN KEY (`VisitorFranchise`) REFERENCES `Franchise` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOAD DATA LOCAL INFILE './PlayerGameStats.csv' 
  INTO TABLE PlayerGameStats 
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;