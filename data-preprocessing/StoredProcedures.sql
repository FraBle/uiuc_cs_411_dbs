delimiter //

CREATE PROCEDURE AllTables ()
BEGIN
 SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'nba';
END//

CREATE PROCEDURE TableByName (tableName CHAR(32))
BEGIN
	SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = tableName;
END//

delimiter ;