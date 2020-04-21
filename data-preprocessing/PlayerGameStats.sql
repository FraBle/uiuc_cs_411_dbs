  CREATE TABLE `PlayerGameStats` (
  `Game` int(11) NOT NULL,
  `Player` int(11) NOT NULL,
  `Franchise` int(11) NOT NULL,
  `MinutesPlayed` tinyint(4) NOT NULL,
  `FieldGoalsMade` tinyint(4) NOT NULL,
  `FieldGoalsAttempted` tinyint(4) NOT NULL,
  `ThreePointersMade` tinyint(4) NOT NULL,
  `ThreePointersAttempted` tinyint(4) NOT NULL,
  `FreeThrowsMade` tinyint(4) NOT NULL,
  `FreeThrowsAttempted` tinyint(4) NOT NULL,
  `OffensiveRebounds` tinyint(4) NOT NULL,
  `DefensiveRebounds` tinyint(4) NOT NULL,
  `Points` tinyint(4) NOT NULL,
  `Assists` tinyint(4) NOT NULL,
  `Steals` tinyint(4) NOT NULL,
  `Blocks` tinyint(4) NOT NULL,
  `Turnovers` tinyint(4) NOT NULL,
  `PersonalFouls` tinyint(4) NOT NULL,
  KEY `Game` (`Game`),
  KEY `Player` (`Player`),
  KEY `Franchise` (`Franchise`),
  CONSTRAINT `PlayerGameStats_ibfk_1` FOREIGN KEY (`Game`) REFERENCES `Games` (`ID`),
  CONSTRAINT `PlayerGameStats_ibfk_2` FOREIGN KEY (`Player`) REFERENCES `Player` (`ID`),
  CONSTRAINT `PlayerGameStats_ibfk_3` FOREIGN KEY (`Franchise`) REFERENCES `Franchise` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOAD DATA LOCAL INFILE './PlayerGameStats.csv' 
  INTO TABLE PlayerGameStats 
  FIELDS TERMINATED BY ',' 
  OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;