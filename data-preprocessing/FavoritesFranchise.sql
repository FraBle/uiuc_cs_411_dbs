CREATE TABLE `FavoritesFranchise` (
  `Franchise` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Franchise`,`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
