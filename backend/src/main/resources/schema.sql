CREATE TABLE `Player` IF NOT EXISTS (
  `ID` int(11) NOT NULL
  `Name` varchar(50) NOT NULL,
  `BirthDate` date NOT NULL,
  `Position` enum('C','C-F','F','F-C','F-G','G','G-F') NOT NULL,
  `Height` varchar(10) NOT NULL,
  `Weight` int(11) NOT NULL,
  `College` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `College` (`College`),
  CONSTRAINT `Player_ibfk_1` FOREIGN KEY (`College`) REFERENCES `College` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;