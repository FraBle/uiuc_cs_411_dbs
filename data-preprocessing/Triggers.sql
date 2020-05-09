DELIMITER //

CREATE TRIGGER User_constraint BEFORE INSERT ON `User`
FOR EACH ROW
BEGIN
    IF NEW.Username NOT REGEXP '^[a-z0-9]{3,20}$'
      THEN signal sqlstate '45000' set message_text = 'username has to be alphanumeric, with length between 3 to 20.';
    END IF;

    IF NEW.Email NOT REGEXP '^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9._-]*\\.[a-zA-Z]{2,4}$'
      THEN signal sqlstate '45000' set message_text = 'invalid email format';
    END IF;
END//

DELIMITER ;