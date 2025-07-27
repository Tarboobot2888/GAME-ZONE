-- GameZone Database Schema
-- MySQL/MariaDB Database Structure

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: gamezone_db
CREATE DATABASE IF NOT EXISTS `gamezone_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gamezone_db`;

-- --------------------------------------------------------

-- Table structure for table `users`
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(128) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `country` varchar(2) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `provider` enum('email','google','github','guest') DEFAULT 'email',
  `email_verified` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `is_admin` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `firebase_uid` (`firebase_uid`),
  KEY `idx_email` (`email`),
  KEY `idx_firebase_uid` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `games`
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `banner_url` text DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `min_price` decimal(10,2) DEFAULT NULL,
  `max_price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT 'SAR',
  `processing_time` int(11) DEFAULT 600,
  `instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_popular` (`is_popular`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `game_packages`
CREATE TABLE `game_packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `bonus` varchar(255) DEFAULT NULL,
  `is_popular` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `game_id` (`game_id`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `game_packages_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `orders`
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `player_id` varchar(255) NOT NULL,
  `player_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'SAR',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `order_status` enum('pending','processing','completed','cancelled','failed') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  KEY `game_id` (`game_id`),
  KEY `package_id` (`package_id`),
  KEY `idx_status` (`order_status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`package_id`) REFERENCES `game_packages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `user_settings`
CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_setting` (`user_id`,`setting_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `login_attempts`
CREATE TABLE `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `success` tinyint(1) DEFAULT 0,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_ip` (`ip_address`),
  KEY `idx_attempted_at` (`attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `admin_logs`
CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Table structure for table `notifications`
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `action_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

-- Insert sample data

-- Insert games
INSERT INTO `games` (`id`, `title`, `slug`, `description`, `category`, `image_url`, `is_popular`, `is_active`, `sort_order`, `min_price`, `max_price`, `processing_time`) VALUES
(1, 'PES Mobile', 'pes-mobile', 'شحن عملات PES Mobile', 'sports', '../assets/images/pes-mobile.jpg', 1, 1, 1, 5.00, 200.00, 300),
(2, 'FIFA Mobile', 'fifa-mobile', 'شحن نقاط FIFA Mobile', 'sports', '../assets/images/fifa-mobile.jpg', 1, 1, 2, 10.00, 350.00, 300),
(3, 'PUBG Mobile', 'pubg-mobile', 'شحن UC PUBG Mobile', 'battle-royale', '../assets/images/pubg-mobile.jpg', 1, 1, 3, 15.00, 500.00, 600),
(4, 'Free Fire', 'free-fire', 'شحن جواهر Free Fire', 'battle-royale', '../assets/images/free-fire.jpg', 1, 1, 4, 8.00, 300.00, 300),
(5, 'Call of Duty Mobile', 'cod-mobile', 'شحن CP Call of Duty', 'fps', '../assets/images/cod-mobile.jpg', 1, 1, 5, 12.00, 400.00, 600),
(6, 'Mobile Legends', 'mobile-legends', 'شحن جواهر Mobile Legends', 'moba', '../assets/images/ml-mobile.jpg', 1, 1, 6, 6.00, 150.00, 300);

-- Insert game packages
INSERT INTO `game_packages` (`game_id`, `name`, `amount`, `price`, `bonus`, `is_popular`, `sort_order`) VALUES
-- PES Mobile packages
(1, 'باقة صغيرة', '100 عملة', 5.00, NULL, 0, 1),
(1, 'باقة متوسطة', '500 عملة', 20.00, '+50 عملة مجاناً', 1, 2),
(1, 'باقة كبيرة', '1000 عملة', 35.00, '+150 عملة مجاناً', 0, 3),
(1, 'باقة ضخمة', '2500 عملة', 80.00, '+500 عملة مجاناً', 0, 4),

-- FIFA Mobile packages
(2, 'باقة صغيرة', '150 نقطة', 10.00, NULL, 0, 1),
(2, 'باقة متوسطة', '750 نقطة', 40.00, '+100 نقطة مجاناً', 1, 2),
(2, 'باقة كبيرة', '1500 نقطة', 75.00, '+300 نقطة مجاناً', 0, 3),
(2, 'باقة ضخمة', '4000 نقطة', 180.00, '+800 نقطة مجاناً', 0, 4),

-- PUBG Mobile packages
(3, 'باقة صغيرة', '60 UC', 15.00, NULL, 0, 1),
(3, 'باقة متوسطة', '325 UC', 70.00, '+25 UC مجاناً', 1, 2),
(3, 'باقة كبيرة', '660 UC', 140.00, '+60 UC مجاناً', 0, 3),
(3, 'باقة ضخمة', '1800 UC', 350.00, '+200 UC مجاناً', 0, 4),

-- Free Fire packages
(4, 'باقة صغيرة', '100 جوهرة', 8.00, NULL, 0, 1),
(4, 'باقة متوسطة', '520 جوهرة', 35.00, '+20 جوهرة مجاناً', 1, 2),
(4, 'باقة كبيرة', '1080 جوهرة', 70.00, '+80 جوهرة مجاناً', 0, 3),
(4, 'باقة ضخمة', '2200 جوهرة', 140.00, '+200 جوهرة مجاناً', 0, 4),

-- Call of Duty Mobile packages
(5, 'باقة صغيرة', '80 CP', 12.00, NULL, 0, 1),
(5, 'باقة متوسطة', '400 CP', 50.00, '+20 CP مجاناً', 1, 2),
(5, 'باقة كبيرة', '800 CP', 95.00, '+80 CP مجاناً', 0, 3),
(5, 'باقة ضخمة', '2000 CP', 220.00, '+200 CP مجاناً', 0, 4),

-- Mobile Legends packages
(6, 'باقة صغيرة', '86 جوهرة', 6.00, NULL, 0, 1),
(6, 'باقة متوسطة', '172 جوهرة', 12.00, '+14 جوهرة مجاناً', 1, 2),
(6, 'باقة كبيرة', '514 جوهرة', 35.00, '+51 جوهرة مجاناً', 0, 3),
(6, 'باقة ضخمة', '1050 جوهرة', 70.00, '+105 جوهرة مجاناً', 0, 4);

-- Insert admin user
INSERT INTO `users` (`email`, `username`, `display_name`, `provider`, `email_verified`, `is_active`, `is_admin`, `created_at`) VALUES
('admin@gamezone.com', 'admin', 'مدير النظام', 'email', 1, 1, 1, NOW());

-- Create indexes for better performance
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_created_date ON orders(DATE(created_at));
CREATE INDEX idx_games_category_active ON games(category, is_active);
CREATE INDEX idx_packages_game_active ON game_packages(game_id, is_active);

-- Create views for common queries
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    u.display_name as user_name,
    u.email as user_email,
    g.title as game_title,
    gp.name as package_name,
    gp.amount as package_amount,
    o.total_amount,
    o.currency,
    o.order_status,
    o.payment_status,
    o.created_at,
    o.completed_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN games g ON o.game_id = g.id
JOIN game_packages gp ON o.package_id = gp.id;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.display_name,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(CASE WHEN o.order_status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
    SUM(CASE WHEN o.order_status = 'completed' THEN o.total_amount ELSE 0 END) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.display_name, u.email;

-- Create stored procedures
DELIMITER //

CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = 1) as total_users,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'completed') as completed_orders,
        (SELECT COUNT(*) FROM orders WHERE order_status = 'pending') as pending_orders,
        (SELECT SUM(total_amount) FROM orders WHERE order_status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM games WHERE is_active = 1) as active_games;
END //

CREATE PROCEDURE GetMonthlyStats(IN target_year INT, IN target_month INT)
BEGIN
    SELECT 
        DAY(created_at) as day,
        COUNT(*) as orders_count,
        SUM(total_amount) as daily_revenue
    FROM orders 
    WHERE YEAR(created_at) = target_year 
    AND MONTH(created_at) = target_month
    AND order_status = 'completed'
    GROUP BY DAY(created_at)
    ORDER BY day;
END //

DELIMITER ;

COMMIT;
