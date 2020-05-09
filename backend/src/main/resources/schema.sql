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
    `createdAt` TIMESTAMP NOT NULL,
    `lastUpdated` TIMESTAMP NOT NULL,
    PRIMARY KEY (`Player`,`Username`)
);

DROP TABLE FavoritesFranchise IF EXISTS;

CREATE TABLE `FavoritesFranchise` (
    `Franchise` INT NOT NULL,
    `Username` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL,
    `lastUpdated` TIMESTAMP NOT NULL,
    PRIMARY KEY (`Franchise`,`Username`)
);

DROP TABLE Franchise IF EXISTS;

CREATE TABLE `Franchise` (
    `ID` INT NOT NULL,
    `Abbreviation` VARCHAR(10) NOT NULL,
    `Nickname` VARCHAR(100) NOT NULL,
    `YearFounded` YEAR(4) NOT NULL,
    `City` VARCHAR(100) NOT NULL,
    `Arena` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`ID`)
);

DROP VIEW FranchiseWinsBySeason IF EXISTS;
DROP VIEW FranchiseWins IF EXISTS;
DROP TABLE Games IF EXISTS;
CREATE TABLE `Games` (
  `ID` int(11) PRIMARY KEY,
  `Season` year(4) NOT NULL,
  `HomeFranchise` int(11)  NOT NULL,
  `VisitorFranchise` int(11)  NOT NULL,
  `Date` date NOT NULL,
  `HomePoints` int(3)  NOT NULL,
  `AwayPoints` int(3)  NOT NULL
);

DROP VIEW `PlayerAllStats` IF EXISTS;
DROP VIEW `PlayerSeasonStats` IF EXISTS;
DROP VIEW `PLAYERFRANCHISESTATS` IF EXISTS;
DROP TABLE PlayerGameStats IF EXISTS;
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
  `PersonalFouls` tinyint(4) NOT NULL
);

CREATE VIEW `PlayerAllStats` AS
SELECT Player,
       SUM(MinutesPlayed) as MinutesPlayed,
       SUM(FieldGoalsMade) as FieldGoalsMade,
       SUM(FieldGoalsAttempted) as FieldGoalsAttempted,
       SUM(ThreePointersMade) as ThreePointersMade,
       SUM(ThreePointersAttempted) as ThreePointersAttempted,
       SUM(FreeThrowsMade) as FreeThrowsMade,
       SUM(FreeThrowsAttempted) as FreeThrowsAttempted,
       SUM(OffensiveRebounds) as OffensiveRebounds,
       SUM(DefensiveRebounds) as DefensiveRebounds,
       SUM(Points) as Points,
       SUM(Assists) as Assists,
       SUM(Steals) as Steals,
       SUM(Blocks) as Blocks,
       SUM(Turnovers) as Turnovers,
       SUM(PersonalFouls) as PersonalFouls
FROM PlayerGameStats
GROUP BY Player;

CREATE VIEW `PlayerSeasonStats` AS
SELECT Player,
       Season,
       SUM(MinutesPlayed) as MinutesPlayed,
       SUM(FieldGoalsMade) as FieldGoalsMade,
       SUM(FieldGoalsAttempted) as FieldGoalsAttempted,
       SUM(ThreePointersMade) as ThreePointersMade,
       SUM(ThreePointersAttempted) as ThreePointersAttempted,
       SUM(FreeThrowsMade) as FreeThrowsMade,
       SUM(FreeThrowsAttempted) as FreeThrowsAttempted,
       SUM(OffensiveRebounds) as OffensiveRebounds,
       SUM(DefensiveRebounds) as DefensiveRebounds,
       SUM(Points) as Points,
       SUM(Assists) as Assists,
       SUM(Steals) as Steals,
       SUM(Blocks) as Blocks,
       SUM(Turnovers) as Turnovers,
       SUM(PersonalFouls) as PersonalFouls
FROM (
  SELECT *
  FROM PlayerGameStats LEFT JOIN Games on (PlayerGameStats.Game = Games.ID)
)
GROUP BY Player, Season;

CREATE VIEW `PlayerFranchiseStats` AS
SELECT Player,
       Franchise,
       SUM(MinutesPlayed) as MinutesPlayed,
       SUM(FieldGoalsMade) as FieldGoalsMade,
       SUM(FieldGoalsAttempted) as FieldGoalsAttempted,
       SUM(ThreePointersMade) as ThreePointersMade,
       SUM(ThreePointersAttempted) as ThreePointersAttempted,
       SUM(FreeThrowsMade) as FreeThrowsMade,
       SUM(FreeThrowsAttempted) as FreeThrowsAttempted,
       SUM(OffensiveRebounds) as OffensiveRebounds,
       SUM(DefensiveRebounds) as DefensiveRebounds,
       SUM(Points) as Points,
       SUM(Assists) as Assists,
       SUM(Steals) as Steals,
       SUM(Blocks) as Blocks,
       SUM(Turnovers) as Turnovers,
       SUM(PersonalFouls) as PersonalFouls
FROM PlayerGameStats
GROUP BY Player, Franchise;

CREATE VIEW `FranchiseWinsBySeason` AS
SELECT FranchiseId, CONCAT(Franchise.City, ' ', Franchise.Nickname) as FranchiseName, Season, COUNT(*) AS VICTORIES FROM
    (SELECT HomeFranchise AS FranchiseId, Season FROM Games WHERE HomePoints > AwayPoints
    UNION ALL
    SELECT VisitorFranchise AS FranchiseId, Season FROM Games WHERE AwayPoints > HomePoints) tmp
JOIN Franchise ON (Franchise.ID=FranchiseId)
GROUP BY FranchiseId, Season;

CREATE VIEW `FranchiseWins` AS
SELECT FranchiseId, FranchiseName, FranchiseWinsSUM(VICTORIES) AS VICTORIES FROM FranchiseWinsBySeason
GROUP BY FranchiseId
ORDER BY VICTORIES DESC;

DROP INDEX IDXURLSHORT IF EXISTS;
DROP TABLE ShortURL IF EXISTS;
CREATE TABLE ShortURL(
    `ID` INT auto_increment PRIMARY KEY,
    `Url` VARCHAR(300) NOT NULL
);

CREATE INDEX IDXURLSHORT ON ShortURL(Url);
