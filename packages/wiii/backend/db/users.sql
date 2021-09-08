-- MySQL
CREATE TABLE IF NOT EXISTS `Users`
(
    `id`        INT          PRIMARY KEY AUTO_INCREMENT,
    `nickname`  VARCHAR(100) NOT NULL,
    `email`     VARCHAR(100) NOT NULL,
    `pass`      VARCHAR(50)  NOT NULL,
    `lastLogin` DATETIME on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8mb4_unicode_ci;

SELECT *
FROM Users;
