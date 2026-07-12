/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - appify_book_v1
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`appify_book_v1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `appify_book_v1`;

/*Table structure for table `cache` */

DROP TABLE IF EXISTS `cache`;

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache` */

/*Table structure for table `cache_locks` */

DROP TABLE IF EXISTS `cache_locks`;

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `cache_locks` */

/*Table structure for table `comments` */

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `likes_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `replies_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_parent_id_foreign` (`parent_id`),
  KEY `comments_post_id_parent_id_id_index` (`post_id`,`parent_id`,`id`),
  CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `comments` */

insert  into `comments`(`id`,`post_id`,`user_id`,`parent_id`,`content`,`image_path`,`likes_count`,`replies_count`,`created_at`,`updated_at`) values 
(1,2,2,NULL,'awesome!',NULL,2,1,'2026-07-12 08:57:39','2026-07-12 13:43:01'),
(2,2,1,NULL,'Looks delicious','comments/XcamwcGVa5VD7zrJkVXpMys330XbRm5xubJFEGkk.png',0,1,'2026-07-12 09:18:13','2026-07-12 13:46:18'),
(3,4,1,NULL,'Looks delicious','comments/uaUcg5c1axyX2BkH1mwmT7izvpPZjFnEinkD8iBx.png',1,1,'2026-07-12 09:18:58','2026-07-12 13:42:38'),
(4,4,6,NULL,'Hurry up!!!',NULL,0,0,'2026-07-12 13:41:14','2026-07-12 13:41:14'),
(5,4,6,3,'Exactly!',NULL,0,0,'2026-07-12 13:42:30','2026-07-12 13:42:30'),
(6,2,6,1,'Thanks',NULL,0,0,'2026-07-12 13:43:01','2026-07-12 13:43:01'),
(7,2,6,2,'Thanks',NULL,0,0,'2026-07-12 13:46:18','2026-07-12 13:46:18'),
(8,3,6,NULL,'Superlative!',NULL,0,0,'2026-07-12 13:46:34','2026-07-12 13:46:34');

/*Table structure for table `failed_jobs` */

DROP TABLE IF EXISTS `failed_jobs`;

CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `failed_jobs` */

/*Table structure for table `job_batches` */

DROP TABLE IF EXISTS `job_batches`;

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `job_batches` */

/*Table structure for table `jobs` */

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `jobs` */

/*Table structure for table `likes` */

DROP TABLE IF EXISTS `likes`;

CREATE TABLE `likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `likeable_type` varchar(255) NOT NULL,
  `likeable_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `likes_unique` (`user_id`,`likeable_id`,`likeable_type`),
  KEY `likes_likeable_type_likeable_id_index` (`likeable_type`,`likeable_id`),
  CONSTRAINT `likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `likes` */

insert  into `likes`(`id`,`user_id`,`likeable_type`,`likeable_id`,`created_at`,`updated_at`) values 
(1,1,'App\\Models\\Post',2,'2026-07-12 09:18:29','2026-07-12 09:18:29'),
(2,3,'App\\Models\\Post',2,'2026-07-11 16:03:35','2026-07-11 16:03:35'),
(3,6,'App\\Models\\Post',3,'2026-07-12 08:28:00','2026-07-12 08:28:00'),
(4,1,'App\\Models\\Post',4,'2026-07-12 09:19:13','2026-07-12 09:19:13'),
(5,3,'App\\Models\\Comment',1,'2026-07-11 16:03:36','2026-07-11 16:03:36'),
(6,2,'App\\Models\\Post',3,'2026-07-12 13:40:03','2026-07-12 13:40:03'),
(7,2,'App\\Models\\Post',2,'2026-07-12 13:40:06','2026-07-12 13:40:06'),
(8,6,'App\\Models\\Post',4,'2026-07-12 13:40:56','2026-07-12 13:40:56'),
(9,6,'App\\Models\\Comment',3,'2026-07-12 13:42:38','2026-07-12 13:42:38'),
(10,6,'App\\Models\\Comment',1,'2026-07-12 13:42:55','2026-07-12 13:42:55');

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `migrations` */

insert  into `migrations`(`id`,`migration`,`batch`) values 
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'0001_01_01_000002_create_jobs_table',1),
(4,'2026_07_11_094935_create_oauth_auth_codes_table',1),
(5,'2026_07_11_094936_create_oauth_access_tokens_table',1),
(6,'2026_07_11_094937_create_oauth_refresh_tokens_table',1),
(7,'2026_07_11_094938_create_oauth_clients_table',1),
(8,'2026_07_11_094939_create_oauth_device_codes_table',1),
(9,'2026_07_11_160000_create_posts_table',1),
(10,'2026_07_11_160100_create_comments_table',1),
(11,'2026_07_11_160200_create_likes_table',1),
(12,'2026_07_12_000000_add_image_to_comments_table',1);

/*Table structure for table `oauth_access_tokens` */

DROP TABLE IF EXISTS `oauth_access_tokens`;

CREATE TABLE `oauth_access_tokens` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `oauth_access_tokens` */

insert  into `oauth_access_tokens`(`id`,`user_id`,`client_id`,`name`,`scopes`,`revoked`,`created_at`,`updated_at`,`expires_at`) values 
('0965d918b33f74de82fcd5c5d2de354414025bcb4618b073a6b39872ec387518091668940e1201b2',13,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:37:28','2026-07-12 08:37:28','2027-07-12 08:37:28'),
('0e82a375115884ed8dc6407d64d612358e4a34514e6308f37449aa52c8c7fb6a6a810a420ef3624d',9,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:21:53','2026-07-12 08:21:53','2027-07-12 08:21:53'),
('10d0cb1eb427adb7f85e4a2a55d2682dc8d09652658e1816aba1c713ab0232262e02c83b4dfb6dad',2,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 08:44:15','2026-07-12 09:17:27','2027-07-12 08:44:15'),
('1ce36a96a8003c9e644a69fb8e84013de88b444e1c3a1587fd6864a1e94b9f6aef0a2fbb3bb09ca1',8,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:21:15','2026-07-12 08:21:15','2027-07-12 08:21:15'),
('274bead37008a964f592d057cc044ab6ed0bd4aa9bf510ed9ed47de0446c48084f7d4d7b8acf615a',10,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:34:33','2026-07-12 08:34:33','2027-07-12 08:34:33'),
('2d899b701777e01a7ca3219b9f15b47ffb6d002b860bf6f7a0bbc69384162dc72d865d0deb60e962',6,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 13:40:52','2026-07-12 13:47:05','2027-07-12 13:40:52'),
('38c29bb641738eda3f3f291d8f2f84a3aa6a6450886bf2c94d7b40a39bcfe7968bf55d1e0ae88798',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-11 15:07:01','2026-07-11 15:07:01','2027-07-11 15:07:01'),
('464694b1e9b202c31414d5795ad25d90d52e6771da2e93b3fb9a1a8e27dbc45d2e69d46a1ccf453f',5,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-11 16:04:44','2026-07-11 16:04:45','2027-07-11 16:04:44'),
('56507c549d773de29f069b23148387681d4d0e514afe3740dc5693149be28bd34f50e71100a308a2',2,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-11 15:04:52','2026-07-11 15:04:52','2027-07-11 15:04:52'),
('56d637e1a9e5b052c580f5df8c1f2470ad429482fbfd7e99dc5fc93256af65157380afdbc3d05789',12,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:36:52','2026-07-12 08:36:52','2027-07-12 08:36:52'),
('5b43e909c99b196806465e237e03a044c26eab74d5c4619ab2fd1000286b4596f907c6e7beb270c6',6,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 07:32:51','2026-07-12 07:32:51','2027-07-12 07:32:51'),
('64e2b112392806ef4cf9e5610c78d8d304d1f8604a97a88fa44950378a55681b635831bc164fb4fa',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-11 15:40:36','2026-07-11 15:40:36','2027-07-11 15:40:36'),
('6a9f66f1b4712a800e4e07db08b777457dea93f6518a11b44bd4edbf801ec8f4cf375c0f8a8edd57',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 08:32:37','2026-07-12 08:43:37','2027-07-12 08:32:37'),
('92129f8159890ddf863c2ff66832a5649dccba554cc00cf933b29da3e8949eb4a95134e5d84fc301',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 09:17:35','2026-07-12 09:22:35','2027-07-12 09:17:35'),
('98ba8307678967d96a49b334bc1fe95b58fc194361faced00be503638432f57d11d2bfdc3c1343e1',3,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-11 16:02:45','2026-07-11 16:04:07','2027-07-11 16:02:45'),
('a01d4bb8a0c994b35c71d49691f1aa8886c00166306d9db6f9a5dd23a3b1b64f3a32b08fa8ebe382',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 07:21:55','2026-07-12 07:21:56','2027-07-12 07:21:55'),
('af346db6ef1894ad1521e7f8eae5c69cb541f44e77c103f6f8f144bfc4ed39cd02423569d99b7c74',11,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:36:13','2026-07-12 08:36:13','2027-07-12 08:36:13'),
('b54d6064ae092583de664e437ba505b164bac2e8ec4ccde2d25908842805898bbe2c00df825d799e',4,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-11 16:03:37','2026-07-11 16:03:37','2027-07-11 16:03:37'),
('c86a322a3694463432aad525a39e32a6373336f138e6c62152d85af6881ac40be433eb1a69d22d91',7,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-12 08:20:41','2026-07-12 08:20:41','2027-07-12 08:20:41'),
('d44af8c8298ef372209aacab73f3b17e014dd14fdc3751fafbb74c8a69564efc3e3425b280b5fad1',6,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 08:18:35','2026-07-12 08:32:29','2027-07-12 08:18:35'),
('e1232f17594cc084e36cad8ba618cd8b054acc5fb659eb62520761d10bbd660509f7843e71287240',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',0,'2026-07-11 09:53:11','2026-07-11 09:53:11','2027-07-11 09:53:11'),
('eef6184d9287af2ac69ae6d220eb7e33a355dd70e29aaabb4c2ddd06a8292e9dc3992d913e128d1e',2,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 13:39:54','2026-07-12 13:40:48','2027-07-12 13:39:54'),
('fef66aa2de51f475f4655a53732c0c8252a5b08b205d54e66514c7b3d19ef4eda5b91a21dd45d0cb',1,'019f5098-53e2-7368-a9e0-05aafeeeb70f','auth_token','[]',1,'2026-07-12 09:22:41','2026-07-12 13:39:47','2027-07-12 09:22:41');

/*Table structure for table `oauth_auth_codes` */

DROP TABLE IF EXISTS `oauth_auth_codes`;

CREATE TABLE `oauth_auth_codes` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `client_id` char(36) NOT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `oauth_auth_codes` */

/*Table structure for table `oauth_clients` */

DROP TABLE IF EXISTS `oauth_clients`;

CREATE TABLE `oauth_clients` (
  `id` char(36) NOT NULL,
  `owner_type` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `secret` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `redirect_uris` text NOT NULL,
  `grant_types` text NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_owner_type_owner_id_index` (`owner_type`,`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `oauth_clients` */

insert  into `oauth_clients`(`id`,`owner_type`,`owner_id`,`name`,`secret`,`provider`,`redirect_uris`,`grant_types`,`revoked`,`created_at`,`updated_at`) values 
('019f5098-53e2-7368-a9e0-05aafeeeb70f',NULL,NULL,'AppifyBook','$2y$12$6NvPeA6O304BG6DZwB7DrOo2ARYX.mGaCcy08xWs3GV9z27KyqB4m','users','[]','[\"personal_access\"]',0,'2026-07-11 09:53:08','2026-07-11 09:53:08');

/*Table structure for table `oauth_device_codes` */

DROP TABLE IF EXISTS `oauth_device_codes`;

CREATE TABLE `oauth_device_codes` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` char(36) NOT NULL,
  `user_code` char(8) NOT NULL,
  `scopes` text NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `user_approved_at` datetime DEFAULT NULL,
  `last_polled_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_device_codes_user_code_unique` (`user_code`),
  KEY `oauth_device_codes_user_id_index` (`user_id`),
  KEY `oauth_device_codes_client_id_index` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `oauth_device_codes` */

/*Table structure for table `oauth_refresh_tokens` */

DROP TABLE IF EXISTS `oauth_refresh_tokens`;

CREATE TABLE `oauth_refresh_tokens` (
  `id` char(80) NOT NULL,
  `access_token_id` char(80) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `oauth_refresh_tokens` */

/*Table structure for table `password_reset_tokens` */

DROP TABLE IF EXISTS `password_reset_tokens`;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `password_reset_tokens` */

/*Table structure for table `posts` */

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `content` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `visibility` enum('public','private') NOT NULL DEFAULT 'public',
  `likes_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `comments_count` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_visibility_id_index` (`visibility`,`id`),
  KEY `posts_user_id_id_index` (`user_id`,`id`),
  CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `posts` */

insert  into `posts`(`id`,`user_id`,`content`,`image_path`,`visibility`,`likes_count`,`comments_count`,`created_at`,`updated_at`) values 
(1,3,'secret',NULL,'private',0,0,'2026-07-11 16:03:07','2026-07-11 16:03:07'),
(2,6,'it\'s breakfast time!','posts/UO77rs23F2fI16WiPi5ubwfkvAzgXZYVbChkkKb2.png','public',3,3,'2026-07-12 08:29:08','2026-07-12 13:46:18'),
(3,1,'The fresh moment of the sunrise. I love that.','posts/ITmbR1lFftcTUVyd2jirRyIJrvLadQYQeC4ziB6j.png','public',2,2,'2026-07-12 08:33:54','2026-07-12 13:46:34'),
(4,2,'It\'s Lunch time!!!!','posts/5Od1ca7yI3FZmOK4FUMqKS79141mMcmeo8x1IL3P.png','public',2,3,'2026-07-12 08:44:47','2026-07-12 13:42:30'),
(5,1,'WiFi slow, but relatives\' news travels at 5G speed.',NULL,'private',0,0,'2026-07-12 13:39:39','2026-07-12 13:39:39'),
(6,2,'Biryani is temporary. Extra alu is forever.',NULL,'private',0,0,'2026-07-12 13:40:41','2026-07-12 13:40:41'),
(7,6,'Debugging: Being a detective in a crime movie where you\'re also the criminal.',NULL,'private',0,0,'2026-07-12 13:44:02','2026-07-12 13:44:02');

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `sessions` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`first_name`,`last_name`,`email`,`email_verified_at`,`password`,`avatar`,`remember_token`,`created_at`,`updated_at`) values 
(1,'MsM','Robin','msmrobin518@gmail.com',NULL,'$2y$12$czpw5JKJrH0JuRHBkE6pGeculVuw24IBiSlgMNxRU9gmpbXi5mNee',NULL,NULL,'2026-07-11 09:53:11','2026-07-11 09:53:11'),
(2,'Kamal','Khan','kamalkhan@gmail.com',NULL,'$2y$12$2wGtlqGHWjX9Ki0rKa2HTOtB/W8NHhUe/6NY1qp.42vFkGjYry/ty',NULL,NULL,'2026-07-11 15:04:43','2026-07-11 15:04:43'),
(3,'Alice','Wonder','alice_1783785763@test.com',NULL,'$2y$12$FefGhVewvs8p1wgqhDoEieCY/txcNhCIoglObgAc3cUWJ28bsv5p6','avatars/avatar_3.png',NULL,'2026-07-11 16:02:44','2026-07-11 16:02:44'),
(4,'Bob','Builder','bob_1783785816@test.com',NULL,'$2y$12$gZcv00k.Ej.VjkY0ReYBpeLgFFFn3hiuypOEpKHxFc.YscXLZSsKy','avatars/avatar_4.png',NULL,'2026-07-11 16:03:37','2026-07-11 16:03:37'),
(5,'Carol','Danvers','carol_1783785883@test.com',NULL,'$2y$12$5daLTJ3BzshOFf62rttEbuWK13rq8x3MdnVz5bZBSkiUiOa1DIN0m','avatars/avatar_5.png',NULL,'2026-07-11 16:04:44','2026-07-11 16:04:44'),
(6,'Jannatul','Tania','tania@gmail.com',NULL,'$2y$12$p2J2xlmxn/1OUfKVKRBUAe2ipU4eww0A4rNvbUaqJsTLfmMFZoTfS','avatars/avatar_6.png',NULL,'2026-07-12 07:32:44','2026-07-12 07:32:49');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
