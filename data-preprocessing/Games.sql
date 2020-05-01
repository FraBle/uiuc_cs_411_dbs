CREATE TABLE `Games` (
  `ID` int(11) NOT NULL,
  `Season` year(4) NOT NULL,
  `HomeFranchise` int(11) NOT NULL,
  `VisitorFranchise` int(11) NOT NULL,
  `Date` date NOT NULL,
  `HomePoints` smallint(6) NOT NULL,
  `HomeFieldGoalPercentage` float NOT NULL,
  `HomeFreeThrowPercentage` float NOT NULL,
  `HomeThreePointerPercentage` float NOT NULL,
  `HomeAssists` smallint(6) NOT NULL,
  `HomeRebounds` smallint(6) NOT NULL,
  `AwayPoints` smallint(6) NOT NULL,
  `AwayFieldGoalPercentage` float NOT NULL,
  `AwayFreeThrowPercentage` float NOT NULL,
  `AwayThreePointerPercentage` float NOT NULL,
  `AwayAssists` smallint(6) NOT NULL,
  `AwayRebounds` smallint(6) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `HomeFranchise` (`HomeFranchise`),
  KEY `VisitorFranchise` (`VisitorFranchise`),
  CONSTRAINT `Games_ibfk_1` FOREIGN KEY (`HomeFranchise`) REFERENCES `Franchise` (`ID`),
  CONSTRAINT `Games_ibfk_2` FOREIGN KEY (`VisitorFranchise`) REFERENCES `Franchise` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOAD DATA LOCAL INFILE './Games.csv' 
  INTO TABLE Games 
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;