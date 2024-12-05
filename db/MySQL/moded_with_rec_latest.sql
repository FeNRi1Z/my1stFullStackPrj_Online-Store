-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2024 at 04:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moded`
--

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

CREATE TABLE `author` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`id`, `name`) VALUES
(1, 'Unknown'),
(2, 'Bob A Man'),
(3, 'Emily Chang'),
(4, 'Michael Rodriguez'),
(5, 'Sarah Kim'),
(6, 'David Chen'),
(7, 'Rachel Williams'),
(8, 'Alex Johnson'),
(9, 'Lisa Patel'),
(10, 'Carlos Mendez'),
(11, 'Karen Thompson'),
(12, 'Lila Green'),
(14, 'James Walker'),
(15, 'Sophie Bloom'),
(16, 'Oliver Bennett'),
(17, 'Margaret Hill'),
(18, 'Emily Carter'),
(19, 'Andrew Kim'),
(20, 'Norton Juster'),
(21, 'Anthony Burgess'),
(22, 'John Steinbeck'),
(23, 'K. A. Applegate'),
(24, 'Ray Bradbury'),
(25, 'David Sedaris'),
(26, 'Dorothy Eden'),
(33, 'J. D. Salinger'),
(34, 'Dante Alighieri'),
(35, 'Robert Bloch'),
(36, 'Mary Shelley'),
(37, 'F. Scott Fitzgerald'),
(38, 'Jon Ronson'),
(39, 'Stephen King'),
(40, 'Eleanor Shearer'),
(41, 'Ralph Ellison'),
(42, 'Dina Nayeri'),
(43, 'Edgar Rice Burroughs'),
(44, 'Milan Kundera'),
(45, 'Mario Puzo'),
(46, 'Samantha Shannon'),
(47, 'Adam Smith'),
(48, 'Mikhail Bulgakov'),
(49, 'Kate Foster'),
(50, 'J.K. Rowling'),
(51, 'Amisha Ghadiali'),
(52, 'Peter Benchley'),
(53, 'Kate Mosse'),
(54, 'Margaret Atwood'),
(55, 'David Means'),
(56, 'Michael Crichton'),
(57, 'Jorge Luis Borges'),
(58, 'Jenny Jackson'),
(59, 'Maya Angelou'),
(60, 'Kelly Link'),
(61, 'Donna Tartt'),
(62, 'Claire Thomas'),
(63, 'Tomi Adeyemi'),
(64, 'William W. Johnstone'),
(65, 'Pik-Shuen Fung'),
(66, 'Simon Lancaster'),
(67, 'Vladimir Nabokov'),
(68, 'Henry Van'),
(69, 'Patrick Ness'),
(70, 'Gabrielle Zevin'),
(71, 'Rosie Dastgir'),
(72, 'George Orwell'),
(73, 'V.C. Andrews'),
(74, 'Jane Austen'),
(75, 'Bret Easton Ellis'),
(76, 'Aldous Huxley'),
(77, 'Evie Woods'),
(78, 'Ishiyama Ryo'),
(79, 'Driscoll Laura'),
(80, 'MoneyrainClub');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Others'),
(2, 'Fiction'),
(3, 'Non-Fiction'),
(4, 'Science Fiction'),
(5, 'Mystery'),
(6, 'Romance'),
(7, 'Biography'),
(8, 'History'),
(9, 'Self-Help'),
(10, 'Science'),
(11, 'Technology'),
(12, 'Fantasy'),
(13, 'Thriller'),
(14, 'Astronomy'),
(15, 'Programming'),
(16, 'Education'),
(17, 'Wellness'),
(18, 'Lifestyle'),
(19, 'Adventure'),
(20, 'Cooking'),
(21, 'Finance'),
(22, 'Adventure fiction'),
(23, 'Short story'),
(24, 'Magic realism'),
(25, 'Physics'),
(26, 'Healthy'),
(27, 'Fairytale'),
(28, 'Western'),
(29, 'Math'),
(30, 'Language'),
(31, 'Crafts'),
(32, 'Hobbies'),
(33, 'Home'),
(34, 'Garden'),
(35, 'Cartoon'),
(36, 'Architecture'),
(37, 'Humor'),
(38, 'Sports'),
(39, 'Tale'),
(40, 'Satire'),
(41, 'Society'),
(42, 'Comic'),
(43, 'Hero'),
(44, 'Novel'),
(45, 'Charming'),
(46, 'Manga'),
(47, 'Psychology');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `orderTotal` int(11) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'To be paid',
  `statusDetail` varchar(191) DEFAULT 'Please complete the payment and confirm the payment',
  `address` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `orderDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `paymentSlipIMG` varchar(191) DEFAULT NULL,
  `paymentDate` datetime(3) DEFAULT NULL,
  `parcelCode` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `userId`, `orderTotal`, `status`, `statusDetail`, `address`, `phone`, `orderDate`, `paymentSlipIMG`, `paymentDate`, `parcelCode`) VALUES
(1, 2, 7408, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13 City:   Bangkok State/province/area:    Bangkok Zip code:  10250 Country:  Thailand', '0347376343', '2024-01-20 19:27:52.819', '2024112411812992.jpg', '2024-11-23 18:18:09.000', 'EF582621151TH'),
(2, 4, 1202, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek Mahanak City:  Dusit State/province/area:    Bangkok Zip code:  10300 Country:  Thailand', '0445364354', '2024-01-21 15:07:20.673', '2024112411645705.jpg', '2024-11-23 18:05:11.000', 'EF575561151TH'),
(3, 2, 2538, 'Completed', 'The order has been completed, thank you for shopping with us', '123 Main St, Springfield', '0834567890', '2024-01-25 17:29:37.326', '20241126173350585.jpg', '2024-11-26 10:33:45.000', 'EF552354351TH'),
(4, 2, 2915, 'Cancelled', 'The order has been cancelled', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-01-25 19:30:21.857', NULL, NULL, NULL),
(6, 2, 2104, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  126/33 Soi Ekamai Sukhumvit 63 Road City: Bangkok State/province/area: Bangkok Zip code: 10110 Country: Thailand', '0834567890', '2024-01-25 19:38:55.375', '2024112815261884.jpg', '2024-11-28 08:25:58.000', 'EC343425234TH'),
(7, 6, 1546, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-01-25 19:41:03.323', NULL, NULL, NULL),
(8, 4, 1619, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0654788766', '2024-01-25 19:56:48.430', '20241128152650812.jpg', '2024-11-28 08:26:47.000', 'EJ543636566TH'),
(9, 4, 220, 'Cancelled', 'The order has been cancelled', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-01-25 20:01:33.975', NULL, NULL, NULL),
(10, 3, 1150, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  Somdej Chao Phraya Khlong San\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10600\nCountry:  Thailand', '0565464656', '2024-01-25 20:04:45.804', '2024112815174285.jpg', '2024-11-28 08:17:31.000', 'ED432453423TH'),
(11, 5, 1650, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-01-25 20:07:59.030', NULL, NULL, NULL),
(12, 5, 333, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-01-25 20:10:31.971', '2024112815286644.jpg', '2024-11-28 08:28:03.000', 'EF234234234TH'),
(13, 6, 900, 'Cancelled', 'The order has been cancelled', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-01-26 07:30:25.006', NULL, NULL, NULL),
(14, 4, 1313, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/3 Soi Prompong (Sukhumvit 39) Sukhumvit Road\nCity:  Wattana\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262587543', '2024-01-27 09:22:16.952', '20241127162320514.jpg', '2024-11-27 09:23:16.000', 'ET345235534TH'),
(15, 5, 1363, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-01-27 09:28:15.908', '20241128152854376.jpg', '2024-11-28 08:28:50.000', 'ED394932848TH'),
(16, 6, 690, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-01-27 14:06:58.908', '20241127211148875.jpg', '2024-11-27 14:11:40.000', 'ET343245424TH'),
(17, 2, 1750, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-01-28 07:22:27.217', '20241128152924718.jpg', '2024-11-28 08:29:21.000', 'ET352345453TH'),
(18, 2, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-01-28 07:22:59.333', '20241128152916614.jpg', '2024-11-28 08:29:13.000', 'ET543854389TH'),
(19, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-01-28 07:23:26.292', '20241128151751802.jpg', '2024-11-28 08:17:47.000', 'ET397548379TH'),
(20, 3, 420, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-01-28 07:42:10.818', '2024112815184985.jpg', '2024-11-28 08:18:00.000', NULL),
(21, 3, 1060, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-02-28 08:36:31.347', NULL, NULL, NULL),
(22, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-02-28 08:36:39.016', NULL, NULL, NULL),
(23, 3, 740, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-02-28 08:36:50.789', NULL, NULL, NULL),
(24, 4, 200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-02-28 08:38:06.794', NULL, NULL, NULL),
(25, 4, 1220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-02-28 08:51:04.813', NULL, NULL, NULL),
(26, 4, 700, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-02-28 08:51:14.084', NULL, NULL, NULL),
(27, 6, 1175, 'Cancelled', 'The order has been cancelled', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:51:45.878', NULL, NULL, NULL),
(28, 6, 750, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:51:54.406', NULL, NULL, NULL),
(29, 6, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:52:01.968', NULL, NULL, NULL),
(30, 6, 850, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:52:56.103', NULL, NULL, NULL),
(31, 6, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:53:03.591', NULL, NULL, NULL),
(32, 6, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-02-28 08:53:10.566', '202412514407220.jpg', '2024-12-05 07:40:07.223', 'ET343392408TH'),
(33, 5, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-02-28 08:54:24.753', NULL, NULL, NULL),
(34, 5, 400, 'Cancelled', 'The order has been cancelled', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-02-28 08:54:31.931', NULL, NULL, NULL),
(35, 5, 1250, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-02-28 08:54:50.804', NULL, NULL, NULL),
(36, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-02-28 08:54:58.058', '2024125143452628.jpg', '2024-12-05 07:34:46.000', 'ET432432432TH'),
(37, 4, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-03-05 08:08:53.099', NULL, NULL, NULL),
(38, 4, 200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-03-05 08:09:23.024', NULL, NULL, NULL),
(39, 4, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-03-05 08:09:53.609', NULL, NULL, NULL),
(40, 5, 530, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-03-05 08:33:52.409', '2024125153528133.jpg', '2024-12-05 08:35:28.136', 'ET354255254TH'),
(41, 5, 1410, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-03-05 11:04:46.993', NULL, NULL, NULL),
(42, 5, 850, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-03-05 11:06:56.108', NULL, NULL, NULL),
(43, 3, 1130, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-03-05 11:08:46.226', NULL, NULL, NULL),
(44, 3, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-03-05 11:08:53.253', NULL, NULL, NULL),
(45, 3, 800, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-03-05 11:09:05.456', NULL, NULL, NULL),
(46, 3, 360, 'Cancelled', 'The order has been cancelled', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-03-05 11:09:14.958', NULL, NULL, NULL),
(47, 2, 760, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-03-05 11:11:08.738', NULL, NULL, NULL),
(48, 2, 1200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-03-05 11:11:29.137', NULL, NULL, NULL),
(49, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-03-05 11:11:39.910', NULL, NULL, NULL),
(50, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-03-05 11:11:48.185', NULL, NULL, NULL),
(51, 3, 222, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:29:39.145', NULL, NULL, NULL),
(52, 3, 440, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:31:09.422', NULL, NULL, NULL),
(53, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:31:17.576', NULL, NULL, NULL),
(54, 3, 550, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:31:30.354', NULL, NULL, NULL),
(55, 3, 900, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:31:39.151', NULL, NULL, NULL),
(56, 3, 880, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:31:53.580', NULL, NULL, NULL),
(57, 3, 800, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-04-05 12:32:00.577', NULL, NULL, NULL),
(58, 4, 900, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:32:24.907', NULL, NULL, NULL),
(59, 4, 450, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:32:32.787', NULL, NULL, NULL),
(60, 4, 360, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:32:42.115', NULL, NULL, NULL),
(61, 4, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:32:50.523', NULL, NULL, NULL),
(62, 4, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:32:59.463', NULL, NULL, NULL),
(63, 4, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-04-05 12:33:48.424', NULL, NULL, NULL),
(64, 5, 800, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:09.489', NULL, NULL, NULL),
(65, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:15.717', NULL, NULL, NULL),
(66, 5, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:23.418', NULL, NULL, NULL),
(67, 5, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:30.828', NULL, NULL, NULL),
(68, 5, 760, 'Cancelled', 'The order has been cancelled', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:44.506', NULL, NULL, NULL),
(69, 5, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:52.352', NULL, NULL, NULL),
(70, 5, 567, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:34:59.618', NULL, NULL, NULL),
(71, 5, 550, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:35:06.994', NULL, NULL, NULL),
(72, 5, 1140, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-04-05 12:35:18.931', NULL, NULL, NULL),
(73, 6, 950, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:38:27.233', NULL, NULL, NULL),
(74, 6, 291, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:38:42.888', NULL, NULL, NULL),
(75, 6, 222, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:39:03.451', NULL, NULL, NULL),
(76, 6, 175, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:39:10.330', NULL, NULL, NULL),
(77, 6, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:40:11.571', NULL, NULL, NULL),
(78, 6, 340, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:40:28.537', NULL, NULL, NULL),
(79, 6, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:40:40.347', NULL, NULL, NULL),
(80, 6, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-04-05 12:40:51.019', '2024125194943588.jpg', '2024-12-05 12:49:43.593', 'ER543969475TH'),
(81, 8, 688, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-05-05 13:03:44.292', NULL, NULL, NULL),
(82, 8, 220, 'Cancelled', 'The order has been cancelled', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-05-05 13:03:55.595', NULL, NULL, NULL),
(83, 8, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-05-05 13:04:03.586', NULL, NULL, NULL),
(84, 8, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-05-05 13:04:09.714', NULL, NULL, NULL),
(85, 8, 780, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-05-05 13:04:16.379', NULL, NULL, NULL),
(86, 2, 530, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:05:58.975', NULL, NULL, NULL),
(87, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:05.805', NULL, NULL, NULL),
(88, 2, 1485, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:19.303', NULL, NULL, NULL),
(89, 2, 1160, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:27.900', NULL, NULL, NULL),
(90, 2, 863, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:36.661', NULL, NULL, NULL),
(91, 2, 400, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:44.142', NULL, NULL, NULL),
(92, 2, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:06:52.500', NULL, NULL, NULL),
(93, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-05-05 13:07:00.509', NULL, NULL, NULL),
(94, 3, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:08:13.967', NULL, NULL, NULL),
(95, 3, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:08:20.783', NULL, NULL, NULL),
(96, 3, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:08:39.772', NULL, NULL, NULL),
(97, 3, 300, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:08:51.790', NULL, NULL, NULL),
(98, 3, 200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:09:01.425', NULL, NULL, NULL),
(99, 3, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:09:10.124', NULL, NULL, NULL),
(100, 3, 1200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-05-05 13:09:29.797', NULL, NULL, NULL),
(101, 4, 1762, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:12:40.919', NULL, NULL, NULL),
(102, 4, 175, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:12:46.948', NULL, NULL, NULL),
(103, 4, 880, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:12:59.640', NULL, NULL, NULL),
(104, 4, 1203, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:13:09.835', NULL, NULL, NULL),
(105, 4, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:13:17.894', NULL, NULL, NULL),
(106, 4, 420, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:13:31.330', NULL, NULL, NULL),
(107, 4, 310, 'Cancelled', 'The order has been cancelled', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-05-05 13:13:40.656', NULL, NULL, NULL),
(108, 5, 2955, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-05-05 13:14:05.772', NULL, NULL, NULL),
(109, 5, 920, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-05-05 13:14:16.625', NULL, NULL, NULL),
(110, 5, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-05-05 13:14:22.085', NULL, NULL, NULL),
(111, 5, 250, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-05-05 13:15:14.515', NULL, NULL, NULL),
(112, 6, 300, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-05-05 13:15:36.212', NULL, NULL, NULL),
(113, 6, 1132, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:38:16.439', NULL, NULL, NULL),
(114, 6, 750, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:38:31.649', NULL, NULL, NULL),
(115, 6, 4086, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:38:57.750', NULL, NULL, NULL),
(116, 6, 1200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:39:41.907', NULL, NULL, NULL),
(117, 6, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:39:54.004', NULL, NULL, NULL),
(118, 6, 349, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-06-05 13:45:06.973', NULL, NULL, NULL),
(119, 8, 1660, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:45:28.366', NULL, NULL, NULL),
(120, 8, 440, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:45:39.848', NULL, NULL, NULL),
(121, 8, 900, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:45:49.146', NULL, NULL, NULL),
(122, 8, 380, 'Cancelled', 'The order has been cancelled', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:45:56.322', NULL, NULL, NULL),
(123, 8, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:46:02.859', NULL, NULL, NULL),
(124, 8, 470, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:46:13.332', NULL, NULL, NULL),
(125, 8, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:46:25.188', '202412520476814.jpg', '2024-12-05 13:47:06.818', 'EF568463598TH'),
(126, 8, 395, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:53:50.152', NULL, NULL, NULL),
(127, 8, 760, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:54:07.254', NULL, NULL, NULL),
(128, 8, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:54:16.845', NULL, NULL, NULL),
(129, 8, 1400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-06-05 13:54:35.132', NULL, NULL, NULL),
(130, 2, 530, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-06-05 13:55:16.359', NULL, NULL, NULL),
(131, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-06-05 13:55:23.375', NULL, NULL, NULL),
(132, 2, 3490, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-06-05 13:55:42.298', NULL, NULL, NULL),
(133, 2, 291, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-06-05 13:56:11.205', NULL, NULL, NULL),
(134, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-06-05 13:56:21.418', NULL, NULL, NULL),
(135, 3, 1287, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-06-05 13:58:35.140', NULL, NULL, NULL),
(136, 3, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-06-05 13:58:45.146', NULL, NULL, NULL),
(137, 3, 1380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-06-05 13:58:57.383', NULL, NULL, NULL),
(138, 3, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-06-05 13:59:11.105', NULL, NULL, NULL),
(139, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-06-05 13:59:27.844', NULL, NULL, NULL),
(140, 3, 571, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:08:39.644', NULL, NULL, NULL),
(141, 3, 175, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:08:47.622', NULL, NULL, NULL),
(142, 3, 873, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:08:54.244', NULL, NULL, NULL),
(143, 3, 640, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:09:09.446', NULL, NULL, NULL),
(144, 3, 567, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:09:22.545', NULL, NULL, NULL),
(145, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:09:30.546', NULL, NULL, NULL),
(146, 3, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:09:41.599', NULL, NULL, NULL),
(147, 3, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:09:50.005', NULL, NULL, NULL),
(148, 3, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:10:01.449', NULL, NULL, NULL),
(149, 3, 1200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:10:11.295', NULL, NULL, NULL),
(150, 3, 360, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:10:17.864', NULL, NULL, NULL),
(151, 3, 660, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-07-05 14:10:29.494', NULL, NULL, NULL),
(152, 4, 698, 'Cancelled', 'The order has been cancelled', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-07-05 14:10:59.918', NULL, NULL, NULL),
(153, 4, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-07-05 14:11:09.500', NULL, NULL, NULL),
(154, 4, 900, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-07-05 14:11:27.898', NULL, NULL, NULL),
(155, 4, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-07-05 14:11:35.783', NULL, NULL, NULL),
(156, 4, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-07-05 14:11:41.541', NULL, NULL, NULL),
(157, 5, 200, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:15:03.411', NULL, NULL, NULL),
(158, 5, 575, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:17:50.397', NULL, NULL, NULL),
(159, 5, 1600, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:17:56.684', NULL, NULL, NULL),
(160, 5, 300, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:03.250', NULL, NULL, NULL),
(161, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:11.938', NULL, NULL, NULL),
(162, 5, 550, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:19.689', NULL, NULL, NULL),
(163, 5, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:26.484', NULL, NULL, NULL),
(164, 5, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:32.935', NULL, NULL, NULL),
(165, 5, 1380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:40.216', NULL, NULL, NULL),
(166, 5, 349, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-07-05 14:18:48.495', NULL, NULL, NULL),
(167, 2, 1050, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:32:47.739', NULL, NULL, NULL),
(168, 2, 730, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:33:01.709', NULL, NULL, NULL),
(169, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:33:08.170', NULL, NULL, NULL),
(170, 2, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:33:16.019', NULL, NULL, NULL),
(171, 2, 1950, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:33:33.041', NULL, NULL, NULL),
(172, 2, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:33:46.733', NULL, NULL, NULL),
(173, 2, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-08-05 14:38:14.930', NULL, NULL, NULL),
(174, 3, 3450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:38:42.528', NULL, NULL, NULL);
INSERT INTO `order` (`id`, `userId`, `orderTotal`, `status`, `statusDetail`, `address`, `phone`, `orderDate`, `paymentSlipIMG`, `paymentDate`, `parcelCode`) VALUES
(175, 3, 1778, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:04.351', NULL, NULL, NULL),
(176, 3, 582, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:11.313', NULL, NULL, NULL),
(177, 3, 567, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:19.486', NULL, NULL, NULL),
(178, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:27.157', NULL, NULL, NULL),
(179, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:36.151', NULL, NULL, NULL),
(180, 3, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:43.351', NULL, NULL, NULL),
(181, 3, 740, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-08-05 14:39:59.001', NULL, NULL, NULL),
(182, 4, 1066, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-08-05 14:40:24.301', NULL, NULL, NULL),
(183, 4, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-08-05 14:40:35.268', NULL, NULL, NULL),
(184, 4, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-08-05 14:40:42.309', NULL, NULL, NULL),
(185, 4, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-08-05 14:40:48.520', NULL, NULL, NULL),
(186, 4, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-08-05 14:40:57.255', NULL, NULL, NULL),
(187, 5, 1771, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:48:15.868', NULL, NULL, NULL),
(188, 5, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:48:37.531', NULL, NULL, NULL),
(189, 5, 175, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:48:44.915', NULL, NULL, NULL),
(190, 5, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:48:53.209', NULL, NULL, NULL),
(191, 5, 450, 'Problem', 'There is a problem with the order, please contact admin', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:48:59.535', NULL, NULL, NULL),
(192, 5, 800, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-09-05 14:49:06.882', NULL, NULL, NULL),
(193, 6, 980, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:49:31.204', NULL, NULL, NULL),
(194, 6, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:49:41.077', NULL, NULL, NULL),
(195, 6, 975, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:49:49.897', NULL, NULL, NULL),
(196, 6, 1082, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:50:07.149', NULL, NULL, NULL),
(197, 6, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:50:15.323', NULL, NULL, NULL),
(198, 6, 720, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:50:28.828', NULL, NULL, NULL),
(199, 6, 250, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:51:04.178', NULL, NULL, NULL),
(200, 6, 250, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:51:16.723', NULL, NULL, NULL),
(201, 6, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-09-05 14:51:26.506', NULL, NULL, NULL),
(202, 8, 340, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:51:48.464', NULL, NULL, NULL),
(203, 8, 850, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:52:02.983', NULL, NULL, NULL),
(204, 8, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:52:09.136', NULL, NULL, NULL),
(205, 8, 830, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:52:15.993', NULL, NULL, NULL),
(206, 8, 513, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:52:36.074', NULL, NULL, NULL),
(207, 8, 450, 'Problem', 'There is a problem with the order, please contact admin', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:52:49.366', NULL, NULL, NULL),
(208, 8, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:53:01.551', NULL, NULL, NULL),
(209, 8, 220, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-09-05 14:53:11.429', NULL, NULL, NULL),
(210, 2, 1299, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-10-05 14:57:54.869', NULL, NULL, NULL),
(211, 2, 1650, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-10-05 14:58:29.443', NULL, NULL, NULL),
(212, 2, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-10-05 14:58:37.800', NULL, NULL, NULL),
(213, 2, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-10-05 14:59:18.730', NULL, NULL, NULL),
(214, 2, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-10-05 14:59:33.803', NULL, NULL, NULL),
(215, 3, 698, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:09.834', NULL, NULL, NULL),
(216, 3, 222, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:15.294', NULL, NULL, NULL),
(217, 3, 175, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:21.091', NULL, NULL, NULL),
(218, 3, 291, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:27.267', NULL, NULL, NULL),
(219, 3, 1180, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:37.283', NULL, NULL, NULL),
(220, 3, 770, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:44.969', NULL, NULL, NULL),
(221, 3, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-10-05 15:11:51.597', NULL, NULL, NULL),
(222, 4, 1145, 'Cancelled', 'The order has been cancelled', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:12:26.870', NULL, NULL, NULL),
(223, 4, 1475, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:13:19.485', NULL, NULL, NULL),
(224, 4, 1320, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:13:29.114', NULL, NULL, NULL),
(225, 4, 360, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:13:37.255', NULL, NULL, NULL),
(226, 4, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:13:54.414', NULL, NULL, NULL),
(227, 4, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:13:59.770', NULL, NULL, NULL),
(228, 4, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:14:06.896', NULL, NULL, NULL),
(229, 4, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:14:13.940', NULL, NULL, NULL),
(230, 4, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-10-05 15:14:22.385', NULL, NULL, NULL),
(231, 5, 800, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:14:39.677', NULL, NULL, NULL),
(232, 5, 567, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:14:45.586', NULL, NULL, NULL),
(233, 5, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:14:53.052', NULL, NULL, NULL),
(234, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:14:59.239', NULL, NULL, NULL),
(235, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:15:05.545', NULL, NULL, NULL),
(236, 5, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024-10-05 15:15:15.416', NULL, NULL, NULL),
(237, 6, 840, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-10-05 15:15:34.188', NULL, NULL, NULL),
(238, 6, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-10-05 15:15:42.240', NULL, NULL, NULL),
(239, 8, 1425, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:22:41.460', NULL, NULL, NULL),
(240, 8, 841, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:22:49.146', NULL, NULL, NULL),
(241, 8, 900, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:22:56.836', NULL, NULL, NULL),
(242, 8, 1150, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:23:07.970', NULL, NULL, NULL),
(243, 8, 400, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:23:16.402', NULL, NULL, NULL),
(244, 8, 908, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:23:26.344', NULL, NULL, NULL),
(245, 8, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:23:44.934', NULL, NULL, NULL),
(246, 8, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:23:51.429', NULL, NULL, NULL),
(247, 8, 222, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-11-05 15:24:02.464', NULL, NULL, NULL),
(248, 2, 1240, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:24:26.778', NULL, NULL, NULL),
(249, 2, 350, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:24:35.083', NULL, NULL, NULL),
(250, 2, 450, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:25:01.742', NULL, NULL, NULL),
(251, 2, 850, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:25:10.912', NULL, NULL, NULL),
(252, 2, 530, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:25:17.458', NULL, NULL, NULL),
(253, 2, 1300, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-11-05 15:25:29.146', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(254, 3, 950, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:09.593', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(255, 3, 380, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:15.843', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(256, 3, 700, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:26.232', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(257, 3, 460, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:33.129', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(258, 3, 420, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:41.072', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(259, 3, 1869, 'Completed', 'The order has been completed, thank you for shopping with us', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '2024-11-05 15:26:50.029', '202412520476814.jpg', '2024-12-05 08:35:28.136', 'EG354365366TH'),
(260, 4, 599, 'To be paid', 'Please complete the payment and confirm the payment', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024-12-01 15:30:09.505', NULL, NULL, NULL),
(261, 2, 400, 'To be paid', 'Please complete the payment and confirm the payment', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '2024-12-03 15:30:34.793', NULL, NULL, NULL),
(262, 6, 1040, 'To be paid', 'Please complete the payment and confirm the payment', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '2024-12-04 15:30:52.966', NULL, NULL, NULL),
(263, 8, 730, 'To be paid', 'Please complete the payment and confirm the payment', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', '2024-12-05 15:31:10.190', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `cost` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `img` varchar(191) NOT NULL DEFAULT 'noIMGFile',
  `status` varchar(191) NOT NULL DEFAULT 'use',
  `desc` varchar(191) DEFAULT NULL,
  `authorId` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `cost`, `price`, `quantity`, `img`, `status`, `desc`, `authorId`) VALUES
(1, 'Echoes of Silence', 234, 569, 293, '20241121223840174.png', 'use', 'A haunting tale of personal discovery and emotional resilience.', 8),
(2, 'The Science of Success', 235, 500, 238, '20241121223848471.png', 'use', 'Evidence-based approaches to personal and professional achievement.', 4),
(3, 'Quantum Horizon', 1200, 1400, 273, '20241121223856232.png', 'use', 'A mind-bending journey through the frontiers of quantum physics.', 3),
(4, 'Coding Masterclass', 417, 575, 3, '2024112122390781.png', 'use', 'Comprehensive guide to modern programming techniques and best practices.', 11),
(5, 'Emotional Intelligence', 234, 333, 6, '2024112122397749.png', 'use', 'Practical strategies for understanding and improving emotional awareness.', 7),
(6, 'Echoes of Silence 2', 1156, 1300, 99, '20241121223916898.png', 'use', 'A new haunting tale of personal discovery and more emotional resilience.', 8),
(7, 'The Digital Revolution', 776, 863, 103, '20241121223923171.png', 'use', 'Exploring the transformative impact of technology on modern society.', 4),
(8, 'Shadows of Yesterday', 804, 900, 230, '20241121223927889.png', 'use', 'A gripping mystery that unravels decades-old secrets.', 6),
(9, 'The Secrets of the Universe', 120, 250, 40, '2024112122417140.png', 'use', 'An intriguing exploration of the cosmos and the mysteries it holds.', 12),
(10, 'Mastering Python', 180, 350, 5, '20241121224224241.jpg', 'use', 'A comprehensive guide for programmers to master Python programming.', 14),
(11, 'The Art of Mindfulness', 90, 150, 70, '20241121224329336.png', 'use', 'Learn techniques to achieve a peaceful and mindful life.', 15),
(12, 'Adventures in Wonderland', 110, 220, 33, '202411221121343.png', 'use', 'A thrilling fantasy novel that takes you on an extraordinary journey.', 16),
(13, 'History\'s Greatest Empires', 150, 250, 68, '2024112411405819.png', 'use', 'An insightful look into the rise and fall of some of the greatest empires in history.', 17),
(14, 'Culinary Delights', 100, 200, 39, '20241124113957672.png', 'use', 'A cookbook filled with recipes from around the world.', 18),
(15, 'The Financial Roadmap', 120, 220, 257, '20241124113948507.png', 'use', 'Your guide to financial independence and wealth-building strategies.', 19),
(17, 'The Catcher in the Rye', 250, 350, 38, '20241128131250767.webp', 'use', 'Illustrated by the author’s friend, E. Michael Mitchell, this iconic cover prominently showcases a horse image. It directs the reader’s focus to the significant symbolism of horses woven thro', 33),
(18, 'The Divine Comedy', 300, 450, 26, '20241128131259182.webp', 'use', 'This appealing book cover signifies Dante’s travels through hell, purgatory, and paradise in an alluring manner. The visuals of hellfire, souls, and free birds very clearly show the three ele', 34),
(19, 'Psycho', 280, 400, 29, '2024112813136999.webp', 'use', 'Famous book covers having minimalistic typography are not very common. The cover design of this book by Tony Palladino justifies the horror theme of the book through the distressed texture an', 35),
(20, 'Frankenstein', 320, 450, 45, '20241128131312411.webp', 'use', 'Frankenstein has many iconic book covers. One of the best book cover designs is this cover which shows gothic and dark aesthetics featuring the famous monster representing the eerie tone of t', 36),
(21, 'The Great Gatsby', 220, 300, 39, '2024112813131887.webp', 'use', 'This cover features the painting of a face floating above New York City lights by the artist Francis Cugat is one of the most celebrated and best book covers in literature. Gatsby’s misplaced', 37),
(22, 'The Psychopath Test: A Journey Through the Madness Industry', 260, 380, 20, '20241128131328878.webp', 'delete', 'The cover of this 2011-published book depicts the core of the book which is based on the experiment devised to test psychopathic behavior and how the brain works immaculately.', 38),
(23, 'Night Shift', 300, 420, 17, '2024112813166780.jpg', 'use', 'The eerie cover of this book which is a compilation of horror short stories, embraces the book’s scary and unsettling theme. The cover makes it clear to the reader that they are about to emba', 39),
(24, 'River Sing Me Home', 270, 400, 26, '24.webp', 'use', 'This book cover has beautiful hues of orange, blue, and red with a woman’s silhouette representing the main character of the story, Rachel. Around her are birds, representing freedom, adding ', 40),
(25, 'Invisible Man', 240, 350, 32, '25.webp', 'use', 'The first edition of the book cover was designed by Edward McKnight Kauffer in 1952. The cover incorporates a man appearing to be in shadows and darkness while looking at something in the lig', 41),
(26, 'A Teaspoon of Earth and Sea', 230, 310, 48, '26.webp', 'use', 'One of the most beautiful covers, it portrays the Earth and Sea in pictorial form as mentioned in the title. The female silhouette depicted as a cave or erosion through which the sea can be v', 42),
(27, 'A Princess of Mars', 250, 360, 21, '27.webp', 'use', 'Frank Frazetta designed the captivating book cover of this science-fiction novel. The red backdrop and brown tones clearly show the setting of the planet Mars. Giant green creatures, a beauti', 43),
(28, 'The Unbearable Lightness of Being', 220, 340, 8, '28.webp', 'use', 'This cover has all the qualities, great book covers have. The philosophical themes, play of light and shadow and the hat picked up in the air evoke a sense of weightlessness or lightness in t', 44),
(29, 'The Godfather', 290, 400, 10, '29.webp', 'use', 'If you know classic book covers, you surely have seen this cover designed by S. Neil Fujita. Fujita’s famous logo design, which portrays a puppeteer orchestrating events, from, behind the cur', 45),
(30, 'The Priory of the Orange Tree', 320, 460, 25, '30.webp', 'use', 'The alluring elements of best fantasy book covers are incorporated into this cover designed by David Mann and illustrated by Ivan Belikov. The cover shows a beautifully designed orange tree i', 46),
(31, 'The Wealth of Nations', 280, 400, 23, '31.webp', 'use', 'The simple, classic off-white aesthetics of this book cover make it signify the historical relevance of this book. The cover represents the Industrial Revolution that took place in 1750 -1760', 47),
(32, 'The Master and Margarita', 300, 450, 40, '32.webp', 'delete', 'One of the iconic book covers, this cover artistically displays the devil who, accompanied by a black cat comes to Moscow. The depiction tastefully showcases how the boundaries between the go', 48),
(33, 'The Maiden', 270, 400, 28, '20241128131558638.jpg', 'use', 'Based on a real-life case, The Maiden’s book cover has all the elements of beautiful book covers. Setting the historical thriller theme of the book, the backdrop with vines, plants, flowers a', 49),
(34, 'Harry Potter and the Sorcerer’s Stone', 250, 350, 33, '34.webp', 'use', 'One of the most famous book covers of all time, this cover is well-known by people of all ages. The cover reveals an iconic scene from the fictional book, Harry Potter playing Quidditch. Harr', 50),
(35, 'Intuition: Access your inner wisdom. Trust your instincts. Find your path.', 260, 380, 20, '35.webp', 'delete', 'Tuning your inner self to develop your mental, emotional, and spiritual awareness is the theme comprehensible from the artistic and mindfully designed cover. Illustrated by Eiko Ojala, this b', 51),
(36, 'Jaws', 300, 420, 17, '36.webp', 'use', 'Designed by artist Paul Bacon, the original hardcover first came out in 1975. This legendary black-hued cover chills our spines. The unaware swimmer in dark water and the monster killer shark', 52),
(37, 'The Ghost Ship', 270, 400, 24, '20241128131552903.jpg', 'use', 'Beautiful illustrations of the ship, dark blue colored background, and drawings of sea waves smoothly paint a picture of the aquatic setting of the story. The dark hues on the cover convey th', 53),
(38, 'The Handmaid’s Tale', 240, 350, 36, '38.webp', 'use', 'Very prominent in the story and covering half the book cover space, is a very tall wall. It stands out compared to the smaller human figures below. This strongly shows that the wall is imposs', 54),
(39, 'Instructions for a Funeral', 250, 360, 31, '39.webp', 'use', 'The coffin-shaped letter cover is more than enough to gain relevance with the title. A creative and genius way to show the short story with the same title in the book. When asked about the ti', 55),
(40, 'Jurassic Park', 280, 400, 25, '40.webp', 'use', 'Designer Chip Kidd’s dream assignment, this iconic book cover tells its own story. Creating an atmosphere of thrill, fear, and awe, the book cover features a T-Rex Skeleton which points towar', 56),
(41, 'Labyrinths: Selected Stories & Other Writings', 260, 380, 9, '41.webp', 'use', 'The intricate and mysterious play of shadow and light on this iconic book cover is what makes the book, thought-provoking. The cover design displaying the labyrinthine patterns, is as enigmat', 57),
(42, 'Pineapple Street', 280, 400, 19, '42.webp', 'use', 'The novel revolves around a family with old money, living in New York City. The fun and captivating, colorful illustrations on the cover take the readers on a ride to the vibrantly decorated ', 58),
(43, 'I Know Why the Caged Bird Sings', 260, 380, 14, '43.webp', 'use', 'A free bird flying in the sunrise hues gives a sense of freedom, exploration, and resilience which the novel follows. The different shades of red and yellow add depth to the design. This cove', 59),
(44, 'Get in Trouble', 280, 400, 13, '44.webp', 'use', 'The cover art reflects the magical and extraordinary feel of Link’s short stories. It often shows a surreal image of an upside-down scene that suggests something unusual or otherworldly, pull', 60),
(45, 'Goldfinch', 300, 450, 31, '45.webp', 'use', 'Based on the original 1654 painting, The Goldfinch by Carel Fabritius, this is one of the best book covers of all time. According to the story, the main character steals the painting and hide', 61),
(46, 'The Performance', 320, 460, 25, '46.webp', 'use', 'The Performance is a novel that explores the lives of three women who go to a theatre to see a play. The unique play of colors with the faces depicts the different shades of the women’s chara', 62),
(47, 'Children of Blood and Bone', 280, 400, 27, '20241128131543743.jpg', 'use', 'The book presents a world of magic, power, and danger. Rich Deas designed the cover to reflect the resilience, beauty, and Black heritage of the main young character. The white hair symbolize', 63),
(48, 'Cat’s Eye', 300, 420, 19, '48.webp', 'use', 'The creepy book cover by Richard Newton shows a cat’s face on a child’s body who is in the arms of a woman. The eerie cat-baby and its ferocious expression with the big green eyes send chills', 64),
(49, 'Ghost Forest', 270, 400, 30, '49', 'delete', 'The soft colors and symbols used on the cover show the cultural influences in the book. The undrawn face also illuminates a sense of an incomplete identity. It’s a gentle but strong picture t', 65),
(50, 'Winning Minds: Secrets From the Language of Leadership', 290, 400, 20, '20241128131458717.jpg', 'delete', 'The brain is the most complicated organ of the human body. These intricate details of the brain are represented by a tangled ball of yarn. A hand pulling the string from this yarn is trying t', 66),
(51, 'Despair', 280, 400, 27, '20241128131447776.jpg', 'use', 'This strange book cover serves as a visual gateway into the unsettling, dark, and mysterious themes of the book. The uncanny image of a human body with a disfigured face attracts the reader’s', 67),
(52, 'Little Rivers: A Book of Essays in Profitable Idleness', 260, 380, 12, '52.webp', 'use', 'This cover falls into the pretty book covers category. The dark blue background and the beautiful natural elements like fireflies, vines, and flowers in golden and green embellishments are a ', 68),
(53, 'More Than This', 280, 400, 22, '53.webp', 'use', 'The yellow door amidst the cross pattern in the background symbolizes the death of the main character. Surprisingly, yellow symbolizes death and the novel makes us think about what being aliv', 69),
(54, 'Tomorrow, and Tomorrow, and Tomorrow', 300, 450, 32, '54.webp', 'use', 'This book, written by the popular author Gabrielle Zevin, comes with a captivating book cover. The book’s title stands out on the cover in bright yellow, pink, and blue, giving a lively and o', 70),
(55, 'A Small Fortune', 320, 460, 29, '55.webp', 'use', 'Designed by Nicole LaRoche in 2012, this book has a minimalistic book cover design. A beautiful, fresh shade of blue as the background, and a kettle pouring colorful drops of what can be deci', 71),
(56, '1984', 240, 350, 36, '56.webp', 'use', 'The mystical eye illustration in dark shadows and the use of black and red colors make it a bold display. The eye symbolizes the idea that “Big Brother is watching,” indicating how the govern', 72),
(57, 'Flowers in the Attic', 260, 380, 13, '57.webp', 'use', 'A house with a captivating girl, Cathy peering from an attic window, a striking image makes this one of the best covers of the book world. The scared expression on her gives us the sense of b', 73),
(58, 'Pride and Prejudice (The Peacock Edition)', 234, 550, 49, '20241128134434996.jpg', 'use', 'The beautiful peacock feathers all across the cover look very enchanting. Illustrated by Hugh Thomson, this cover is one of the many popular book covers designed for this book. The peacock ca', 74),
(59, 'A Clockwork Orange', 135, 220, 57, '20241128134427128.webp', 'use', 'Published in 1962, this book cover announces the movie tie-up with the book. Penguin UK’s first edition of the novel introduced the iconic ‘cog-eyed droog’ book cover, which has since become ', 21),
(60, 'The Grapes of Wrath', 340, 400, 68, '20241128134418722.webp', 'use', 'The cover of this Pulitzer Prize-winning novel depicts the main characters of the story, the Joad family, and how they have to leave their home in search of work. The book cover design showca', 22),
(61, 'American Psycho', 150, 200, 94, '20241128134412501.webp', 'use', 'The book cover art of this 1991-published book was based on a painting by American illustrator and artist Marshall Arisman, who made the book cover himself. The cover is a haunting representa', 75),
(62, 'Brave New World', 467, 567, 94, '20241128134477.webp', 'use', 'A dystopian novel published in 1932, the story is based on a world where people live in a superficial state of happiness. Being one of the best book cover designs, it portrays the aspects of ', 76),
(63, 'Animorphs – The Stranger', 376, 530, 77, '2024112813435998.webp', 'use', 'This well-known fantasy series revolves around 5 humans, the Animorphs, who can turn into any animal they touch. David Mattingly, the artist behind Animorph book covers used a special editing', 23),
(64, 'Fahrenheit 451', 324, 420, 51, '20241128134350852.webp', 'use', 'The first cover of this novel published in 1953 was illustrated by Joseph Mugnaini. The cover shows the main character, Guy Montag who burns down houses in which books have been found as a jo', 24),
(65, 'When You Are Engulfed in Flames', 200, 220, 0, '20241128134343667.webp', 'use', 'The cover shows a literal skeleton smoking a cigarette. It represents the title that comes from a tourist advice card, author Sedaris discovers in Japan, where he’d gone to quit smoking. The ', 25),
(66, 'Face of an Angel', 300, 400, 0, '20241128134337940.webp', 'use', 'The story follows a young woman who moves into an old mansion and discovers its dark and eerie secrets. The themes of this story are exceptionally showcased on the book cover in a gothic lady', 26),
(67, 'The Lost Bookshop', 250, 291, 10, '202412518222998.jpg', 'use', '‘The thing about books,’ she said ‘is that they help you to imagine a life bigger and better than you could ever dream of.’\nOn a quiet street in Dublin, a lost bookshop is waiting to be found', 77),
(68, 'Dragon and Chameleon', 149, 175, 45, '202412518263548.jpg', 'use', 'Garyo Hanagami is a best-selling manga artist praised as a genius of the craft. Shinobu Miyama is a bitter rookie with a knack for copying other people\'s art styles. When an accident causes t', 78),
(69, 'I Want to Be An Artist', 150, 222, 16, '2024125182749805.jpg', 'use', 'When I go out for the day with Papa, I learn that there are many different ways to be an artist. Did you know that there are sculptors, photographers, animators-and many more! Maybe I\'ll be a', 79),
(70, 'กฎเหล็ก 99 ประการ(แห่งการแหกกฎชีวิต)', 99, 349, 78, '2024125204440398.gif', 'use', 'พร้อมที่จะแหกกฎของชีวิตหรือยัง? เปิดอ่านได้เลย ขอเตือนว่าต้องอ่านสักครั้งก่อนตายนะ ไม่อย่างงั้นระวังตายตาไม่หลับ\n\nหนังสือเล่มนี้ไม่เหมาะกับพวกโลกสวย\nหนังสือเล่มนี้ไม่เหมาะกับพวกกะโปก\nหนังสือเ', 80);

-- --------------------------------------------------------

--
-- Table structure for table `productcategory`
--

CREATE TABLE `productcategory` (
  `productId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productcategory`
--

INSERT INTO `productcategory` (`productId`, `categoryId`) VALUES
(1, 8),
(1, 10),
(2, 8),
(2, 11),
(3, 6),
(3, 7),
(3, 11),
(4, 9),
(4, 11),
(5, 9),
(5, 10),
(6, 2),
(6, 5),
(6, 13),
(7, 8),
(7, 10),
(7, 11),
(8, 2),
(8, 5),
(8, 12),
(9, 3),
(9, 10),
(9, 14),
(10, 11),
(10, 15),
(10, 16),
(11, 9),
(11, 17),
(11, 18),
(12, 2),
(12, 12),
(12, 19),
(13, 3),
(13, 8),
(13, 16),
(14, 18),
(14, 20),
(15, 9),
(15, 16),
(15, 21),
(17, 5),
(17, 12),
(18, 1),
(18, 5),
(18, 19),
(19, 6),
(19, 18),
(19, 25),
(20, 2),
(20, 27),
(21, 3),
(21, 15),
(22, 7),
(22, 13),
(23, 10),
(23, 26),
(24, 9),
(24, 14),
(24, 28),
(25, 8),
(25, 22),
(26, 4),
(26, 16),
(27, 2),
(27, 5),
(27, 6),
(28, 5),
(28, 24),
(29, 28),
(29, 35),
(30, 1),
(30, 18),
(31, 2),
(31, 8),
(31, 12),
(32, 3),
(32, 15),
(33, 4),
(33, 18),
(34, 2),
(34, 5),
(34, 12),
(34, 19),
(34, 22),
(35, 6),
(35, 18),
(35, 25),
(36, 2),
(36, 4),
(36, 7),
(36, 10),
(36, 13),
(36, 24),
(37, 16),
(37, 28),
(37, 31),
(37, 32),
(38, 39),
(39, 5),
(39, 24),
(40, 2),
(40, 4),
(40, 8),
(40, 10),
(40, 11),
(40, 12),
(40, 19),
(40, 22),
(40, 28),
(41, 6),
(41, 18),
(41, 25),
(42, 7),
(42, 13),
(43, 10),
(43, 26),
(44, 9),
(44, 14),
(44, 28),
(45, 1),
(45, 18),
(46, 2),
(46, 27),
(47, 3),
(47, 15),
(48, 2),
(48, 5),
(48, 13),
(48, 28),
(49, 9),
(49, 14),
(49, 28),
(50, 7),
(50, 13),
(51, 6),
(51, 18),
(51, 25),
(52, 5),
(52, 24),
(53, 9),
(53, 14),
(53, 28),
(54, 1),
(54, 18),
(55, 2),
(55, 27),
(56, 8),
(56, 22),
(57, 10),
(57, 26),
(58, 1),
(58, 3),
(58, 28),
(58, 31),
(59, 33),
(59, 35),
(59, 37),
(60, 23),
(60, 33),
(61, 16),
(61, 28),
(61, 40),
(61, 41),
(62, 2),
(62, 4),
(62, 11),
(63, 5),
(63, 12),
(63, 19),
(64, 4),
(64, 10),
(64, 12),
(64, 19),
(64, 42),
(64, 43),
(65, 1),
(65, 9),
(65, 40),
(66, 2),
(66, 5),
(66, 12),
(66, 13),
(67, 5),
(67, 44),
(67, 45),
(68, 35),
(68, 46),
(69, 16),
(69, 23),
(69, 35),
(70, 47);

-- --------------------------------------------------------

--
-- Table structure for table `productoncart`
--

CREATE TABLE `productoncart` (
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productonorder`
--

CREATE TABLE `productonorder` (
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `productPrice` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `productCost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productonorder`
--

INSERT INTO `productonorder` (`orderId`, `productId`, `productPrice`, `quantity`, `productCost`) VALUES
(1, 3, 1400, 2, 1200),
(1, 4, 575, 3, 417),
(1, 7, 863, 1, 776),
(1, 8, 900, 2, 804),
(1, 12, 220, 1, 110),
(2, 1, 569, 1, 234),
(2, 5, 333, 1, 234),
(2, 11, 150, 2, 90),
(3, 1, 569, 2, 234),
(3, 3, 1400, 1, 1200),
(4, 3, 1400, 1, 1200),
(4, 4, 575, 1, 417),
(4, 9, 250, 2, 120),
(4, 12, 220, 2, 110),
(6, 4, 575, 1, 417),
(6, 5, 333, 2, 234),
(6, 7, 863, 1, 776),
(7, 5, 333, 1, 234),
(7, 7, 863, 1, 776),
(7, 10, 350, 1, 180),
(8, 1, 569, 1, 234),
(8, 2, 500, 1, 235),
(8, 11, 150, 1, 90),
(8, 14, 200, 2, 100),
(9, 15, 220, 1, 120),
(10, 4, 575, 2, 417),
(11, 3, 1400, 1, 1200),
(11, 13, 250, 1, 150),
(12, 5, 333, 1, 234),
(13, 8, 900, 1, 804),
(14, 7, 863, 1, 776),
(14, 9, 250, 1, 120),
(14, 14, 200, 1, 100),
(15, 2, 500, 1, 235),
(15, 7, 863, 1, 776),
(16, 9, 250, 1, 120),
(16, 15, 220, 2, 120),
(17, 11, 150, 1, 90),
(17, 24, 400, 1, 270),
(17, 42, 400, 1, 280),
(17, 44, 400, 2, 280),
(18, 17, 350, 1, 250),
(19, 66, 400, 1, 300),
(20, 61, 200, 1, 150),
(20, 65, 220, 1, 200),
(21, 37, 400, 1, 270),
(21, 46, 460, 1, 320),
(21, 61, 200, 1, 150),
(22, 42, 400, 1, 280),
(23, 28, 340, 1, 220),
(23, 31, 400, 1, 280),
(24, 61, 200, 1, 150),
(25, 44, 400, 1, 280),
(25, 48, 420, 1, 300),
(25, 60, 400, 1, 340),
(26, 34, 350, 2, 250),
(27, 4, 575, 1, 417),
(27, 9, 250, 1, 120),
(27, 10, 350, 1, 180),
(28, 59, 220, 1, 135),
(28, 63, 530, 1, 376),
(29, 40, 400, 1, 280),
(30, 44, 400, 1, 280),
(30, 45, 450, 1, 300),
(31, 33, 400, 1, 270),
(32, 15, 220, 1, 120),
(33, 65, 220, 1, 200),
(34, 51, 400, 1, 280),
(35, 18, 450, 1, 300),
(35, 29, 400, 1, 290),
(35, 31, 400, 1, 280),
(36, 53, 400, 1, 280),
(37, 56, 350, 1, 240),
(38, 61, 200, 1, 150),
(39, 59, 220, 1, 135),
(40, 26, 310, 1, 230),
(40, 59, 220, 1, 135),
(41, 30, 460, 1, 320),
(41, 48, 420, 1, 300),
(41, 63, 530, 1, 376),
(42, 54, 450, 1, 300),
(42, 60, 400, 1, 340),
(43, 11, 150, 1, 90),
(43, 13, 250, 1, 150),
(43, 34, 350, 1, 250),
(43, 57, 380, 1, 260),
(44, 57, 380, 1, 260),
(45, 33, 400, 1, 270),
(45, 37, 400, 1, 270),
(46, 27, 360, 1, 250),
(47, 43, 380, 2, 260),
(48, 12, 220, 2, 110),
(48, 28, 340, 1, 220),
(48, 64, 420, 1, 324),
(49, 44, 400, 1, 280),
(50, 51, 400, 1, 280),
(51, 69, 222, 1, 150),
(52, 59, 220, 2, 135),
(53, 42, 400, 1, 280),
(54, 13, 250, 1, 150),
(54, 21, 300, 1, 220),
(55, 8, 900, 1, 804),
(56, 56, 350, 1, 240),
(56, 63, 530, 1, 376),
(57, 42, 400, 1, 280),
(57, 53, 400, 1, 280),
(58, 2, 500, 1, 235),
(58, 44, 400, 1, 280),
(59, 45, 450, 1, 300),
(60, 39, 360, 1, 250),
(61, 20, 450, 1, 320),
(62, 55, 460, 1, 320),
(63, 19, 400, 1, 280),
(64, 40, 400, 1, 280),
(64, 42, 400, 1, 280),
(65, 60, 400, 1, 340),
(66, 38, 350, 1, 240),
(67, 25, 350, 1, 240),
(68, 27, 360, 1, 250),
(68, 31, 400, 1, 280),
(69, 46, 460, 1, 320),
(70, 62, 567, 1, 467),
(71, 58, 550, 1, 234),
(72, 41, 380, 3, 260),
(73, 63, 530, 1, 376),
(73, 64, 420, 1, 324),
(74, 67, 291, 1, 250),
(75, 69, 222, 1, 150),
(76, 68, 175, 1, 149),
(77, 52, 380, 1, 260),
(78, 28, 340, 1, 220),
(79, 45, 450, 1, 300),
(80, 40, 400, 1, 280),
(81, 67, 291, 1, 250),
(81, 68, 175, 1, 149),
(81, 69, 222, 1, 150),
(82, 65, 220, 1, 200),
(83, 64, 420, 1, 324),
(84, 52, 380, 1, 260),
(85, 41, 380, 1, 260),
(85, 44, 400, 1, 280),
(86, 63, 530, 1, 376),
(87, 60, 400, 1, 340),
(88, 4, 575, 1, 417),
(88, 46, 460, 1, 320),
(88, 54, 450, 1, 300),
(89, 31, 400, 1, 280),
(89, 33, 400, 1, 270),
(89, 39, 360, 1, 250),
(90, 7, 863, 1, 776),
(91, 29, 400, 1, 290),
(92, 36, 420, 1, 300),
(93, 47, 400, 1, 280),
(94, 55, 460, 1, 320),
(95, 59, 220, 1, 135),
(96, 20, 450, 1, 320),
(97, 21, 300, 1, 220),
(98, 14, 200, 1, 100),
(99, 48, 420, 1, 300),
(100, 17, 350, 1, 250),
(100, 18, 450, 1, 300),
(100, 19, 400, 1, 280),
(101, 4, 575, 1, 417),
(101, 11, 150, 1, 90),
(101, 12, 220, 1, 110),
(101, 13, 250, 1, 150),
(101, 62, 567, 1, 467),
(102, 68, 175, 1, 149),
(103, 23, 420, 1, 300),
(103, 30, 460, 1, 320),
(104, 7, 863, 1, 776),
(104, 28, 340, 1, 220),
(105, 41, 380, 1, 260),
(106, 23, 420, 1, 300),
(107, 26, 310, 1, 230),
(108, 4, 575, 1, 417),
(108, 9, 250, 1, 120),
(108, 15, 220, 1, 120),
(108, 21, 300, 1, 220),
(108, 52, 380, 1, 260),
(108, 54, 450, 1, 300),
(108, 57, 380, 1, 260),
(108, 60, 400, 1, 340),
(109, 9, 250, 1, 120),
(109, 13, 250, 1, 150),
(109, 36, 420, 1, 300),
(110, 65, 220, 1, 200),
(111, 9, 250, 1, 120),
(112, 21, 300, 1, 220),
(113, 52, 380, 1, 260),
(113, 63, 530, 1, 376),
(113, 69, 222, 1, 150),
(114, 33, 400, 1, 270),
(114, 34, 350, 1, 250),
(115, 2, 500, 1, 235),
(115, 3, 1400, 1, 1200),
(115, 5, 333, 1, 234),
(115, 7, 863, 1, 776),
(115, 13, 250, 1, 150),
(115, 28, 340, 1, 220),
(115, 29, 400, 1, 290),
(116, 9, 250, 1, 120),
(116, 29, 400, 1, 290),
(116, 58, 550, 1, 234),
(117, 53, 400, 1, 280),
(118, 70, 349, 1, 99),
(119, 19, 400, 1, 280),
(119, 64, 420, 3, 324),
(120, 15, 220, 2, 120),
(121, 54, 450, 2, 300),
(122, 43, 380, 1, 260),
(123, 29, 400, 1, 290),
(124, 12, 220, 1, 110),
(124, 13, 250, 1, 150),
(125, 23, 420, 1, 300),
(126, 65, 220, 1, 200),
(126, 68, 175, 1, 149),
(127, 41, 380, 1, 260),
(127, 52, 380, 1, 260),
(128, 40, 400, 1, 280),
(129, 3, 1400, 1, 1200),
(130, 63, 530, 1, 376),
(131, 53, 400, 1, 280),
(132, 70, 349, 10, 99),
(133, 67, 291, 1, 250),
(134, 42, 400, 1, 280),
(135, 27, 360, 2, 250),
(135, 62, 567, 1, 467),
(136, 36, 420, 1, 300),
(137, 30, 460, 3, 320),
(138, 10, 350, 1, 180),
(139, 24, 400, 1, 270),
(140, 69, 222, 1, 150),
(140, 70, 349, 1, 99),
(141, 68, 175, 1, 149),
(142, 67, 291, 3, 250),
(143, 64, 420, 1, 324),
(143, 65, 220, 1, 200),
(144, 62, 567, 1, 467),
(145, 60, 400, 1, 340),
(146, 57, 380, 1, 260),
(147, 55, 460, 1, 320),
(148, 48, 420, 1, 300),
(149, 37, 400, 3, 270),
(150, 39, 360, 1, 250),
(151, 15, 220, 3, 120),
(152, 70, 349, 2, 99),
(153, 57, 380, 1, 260),
(154, 8, 900, 1, 804),
(155, 51, 400, 1, 280),
(156, 44, 400, 1, 280),
(157, 61, 200, 1, 150),
(158, 53, 400, 1, 280),
(158, 68, 175, 1, 149),
(159, 44, 400, 4, 280),
(160, 21, 300, 1, 220),
(161, 19, 400, 1, 280),
(162, 58, 550, 1, 234),
(163, 55, 460, 1, 320),
(164, 41, 380, 1, 260),
(165, 46, 460, 3, 320),
(166, 70, 349, 1, 99),
(167, 25, 350, 3, 240),
(168, 38, 350, 1, 240),
(168, 41, 380, 1, 260),
(169, 29, 400, 1, 290),
(170, 20, 450, 1, 320),
(171, 9, 250, 1, 120),
(171, 42, 400, 2, 280),
(171, 45, 450, 2, 300),
(172, 24, 400, 1, 270),
(173, 38, 350, 1, 240),
(174, 3, 1400, 1, 1200),
(174, 18, 450, 1, 300),
(174, 36, 420, 1, 300),
(174, 41, 380, 1, 260),
(174, 53, 400, 1, 280),
(174, 60, 400, 1, 340),
(175, 12, 220, 3, 110),
(175, 64, 420, 1, 324),
(175, 70, 349, 2, 99),
(176, 67, 291, 2, 250),
(177, 62, 567, 1, 467),
(178, 44, 400, 1, 280),
(179, 33, 400, 1, 270),
(180, 30, 460, 1, 320),
(181, 19, 400, 1, 280),
(181, 28, 340, 1, 220),
(182, 5, 333, 2, 234),
(182, 29, 400, 1, 290),
(183, 64, 420, 1, 324),
(184, 52, 380, 1, 260),
(185, 45, 450, 1, 300),
(186, 42, 400, 1, 280),
(187, 2, 500, 1, 235),
(187, 18, 450, 1, 300),
(187, 63, 530, 1, 376),
(187, 67, 291, 1, 250),
(188, 9, 250, 1, 120),
(188, 61, 200, 1, 150),
(189, 68, 175, 1, 149),
(190, 64, 420, 1, 324),
(191, 54, 450, 1, 300),
(192, 53, 400, 2, 280),
(193, 14, 200, 1, 100),
(193, 47, 400, 1, 280),
(193, 57, 380, 1, 260),
(194, 12, 220, 1, 110),
(195, 4, 575, 1, 417),
(195, 19, 400, 1, 280),
(196, 29, 400, 1, 290),
(196, 30, 460, 1, 320),
(196, 69, 222, 1, 150),
(197, 24, 400, 1, 270),
(198, 21, 300, 1, 220),
(198, 23, 420, 1, 300),
(199, 13, 250, 1, 150),
(200, 9, 250, 1, 120),
(201, 57, 380, 1, 260),
(202, 28, 340, 1, 220),
(203, 10, 350, 1, 180),
(203, 11, 150, 1, 90),
(203, 25, 350, 1, 240),
(204, 46, 460, 1, 320),
(205, 52, 380, 1, 260),
(205, 54, 450, 1, 300),
(206, 67, 291, 1, 250),
(206, 69, 222, 1, 150),
(207, 20, 450, 1, 320),
(208, 23, 420, 1, 300),
(209, 59, 220, 1, 135),
(210, 31, 400, 1, 280),
(210, 58, 550, 1, 234),
(210, 70, 349, 1, 99),
(211, 48, 420, 1, 300),
(211, 55, 460, 1, 320),
(211, 56, 350, 1, 240),
(211, 64, 420, 1, 324),
(212, 46, 460, 1, 320),
(213, 30, 460, 1, 320),
(214, 46, 460, 1, 320),
(215, 70, 349, 2, 99),
(216, 69, 222, 1, 150),
(217, 68, 175, 1, 149),
(218, 67, 291, 1, 250),
(219, 42, 400, 1, 280),
(219, 43, 380, 1, 260),
(219, 44, 400, 1, 280),
(220, 23, 420, 1, 300),
(220, 25, 350, 1, 240),
(221, 37, 400, 1, 270),
(222, 4, 575, 1, 417),
(222, 12, 220, 1, 110),
(222, 25, 350, 1, 240),
(223, 2, 500, 1, 235),
(223, 23, 420, 1, 300),
(223, 41, 380, 1, 260),
(223, 68, 175, 1, 149),
(224, 8, 900, 1, 804),
(224, 23, 420, 1, 300),
(225, 39, 360, 1, 250),
(226, 64, 420, 1, 324),
(227, 60, 400, 1, 340),
(228, 48, 420, 1, 300),
(229, 45, 450, 1, 300),
(230, 41, 380, 1, 260),
(231, 33, 400, 1, 270),
(231, 44, 400, 1, 280),
(232, 62, 567, 1, 467),
(233, 55, 460, 1, 320),
(234, 29, 400, 1, 290),
(235, 33, 400, 1, 270),
(236, 31, 400, 1, 280),
(237, 36, 420, 2, 300),
(238, 46, 460, 1, 320),
(239, 8, 900, 1, 804),
(239, 10, 350, 1, 180),
(239, 68, 175, 1, 149),
(240, 58, 550, 1, 234),
(240, 67, 291, 1, 250),
(241, 45, 450, 2, 300),
(242, 34, 350, 1, 250),
(242, 44, 400, 2, 280),
(243, 40, 400, 1, 280),
(244, 4, 575, 1, 417),
(244, 5, 333, 1, 234),
(245, 10, 350, 1, 180),
(246, 30, 460, 1, 320),
(247, 69, 222, 1, 150),
(248, 42, 400, 1, 280),
(248, 64, 420, 2, 324),
(249, 38, 350, 1, 240),
(250, 54, 450, 1, 300),
(251, 20, 450, 1, 320),
(251, 29, 400, 1, 290),
(252, 63, 530, 1, 376),
(253, 6, 1300, 1, 1156),
(254, 12, 220, 1, 110),
(254, 43, 380, 1, 260),
(254, 56, 350, 1, 240),
(255, 43, 380, 1, 260),
(256, 34, 350, 2, 250),
(257, 30, 460, 1, 320),
(258, 36, 420, 1, 300),
(259, 1, 569, 1, 234),
(259, 6, 1300, 1, 1156),
(260, 9, 250, 1, 120),
(260, 70, 349, 1, 99),
(261, 47, 400, 1, 280),
(262, 12, 220, 1, 110),
(262, 31, 400, 1, 280),
(262, 36, 420, 1, 300),
(263, 25, 350, 1, 240),
(263, 52, 380, 1, 260);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'client',
  `status` varchar(191) NOT NULL DEFAULT 'use',
  `address` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `profile` varchar(191) NOT NULL DEFAULT 'noIMGFile',
  `cartQty` int(11) NOT NULL DEFAULT 0,
  `cartTotal` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `username`, `password`, `role`, `status`, `address`, `phone`, `profile`, `cartQty`, `cartTotal`) VALUES
(1, 'Dew', 'admin', 'admin', 'admin', 'use', NULL, NULL, 'ChippyEmma.jpg', 0, 0),
(2, 'Client01', 'c01', 'c01', 'client', 'use', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', '20241125224014284.png', 0, 0),
(3, 'Client02', 'c02', 'c02', 'client', 'use', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0372358534', '20241128153535131.webp', 0, 0),
(4, 'Client03', 'c03', 'c03', 'client', 'use', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', '2024125151753672.png', 0, 0),
(5, 'Client04', 'c04', 'c04', 'client', 'use', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', '2024125151845597.png', 0, 0),
(6, 'Phakawat Rattanasopa', 'pr', 'pr', 'client', 'use', 'Street:  19/8 Soi Latphrao 23 Latyao\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10900\nCountry:  Thailand', '0945737600', '202412515193202.png', 0, 0),
(8, 'gg ez', 'gg', 'ez', 'client', 'use', 'Street: 529,\nTown: Bang Kaeo Town Municipality\nCounty/Department: Bang Phli District\nState/Region: Samut Prakan Province\nPostcode: 10540\nCountry: Thailand', '0854674845', 'noIMGFile', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('5eda6e71-5c1c-4d88-8398-6c8b3e8e364b', 'df27517af3380d665c81ae30866cd96366c93f798abafae4b4f638d57c8d27c8', '2024-11-27 05:50:27.177', '20241127055027_add_product_cost', NULL, NULL, '2024-11-27 05:50:27.166', 1),
('7b33b3c2-832e-4a10-a571-21289823be8d', 'a1aea2147322f3246e8feb0e81e3850791bf5cfa831c3ff0ec13897f2d9f919c', '2024-11-27 05:52:48.931', '20241127055248_delete_product_cost_default', NULL, NULL, '2024-11-27 05:52:48.918', 1),
('947b3dad-bac6-483b-b0d6-41656be05d59', '0198d19fe13aff35a43c3f7d664524d08d324cb49f46115839e18adbc9e86267', '2024-11-20 17:47:27.411', '20241120174726_init', NULL, NULL, '2024-11-20 17:47:26.895', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author`
--
ALTER TABLE `author`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_authorId_fkey` (`authorId`);

--
-- Indexes for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD PRIMARY KEY (`productId`,`categoryId`),
  ADD KEY `ProductCategory_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `productoncart`
--
ALTER TABLE `productoncart`
  ADD PRIMARY KEY (`userId`,`productId`),
  ADD KEY `ProductOnCart_productId_fkey` (`productId`);

--
-- Indexes for table `productonorder`
--
ALTER TABLE `productonorder`
  ADD PRIMARY KEY (`orderId`,`productId`),
  ADD KEY `ProductOnOrder_productId_fkey` (`productId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_key` (`username`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author`
--
ALTER TABLE `author`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=264;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `author` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productcategory`
--
ALTER TABLE `productcategory`
  ADD CONSTRAINT `ProductCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductCategory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productoncart`
--
ALTER TABLE `productoncart`
  ADD CONSTRAINT `ProductOnCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductOnCart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productonorder`
--
ALTER TABLE `productonorder`
  ADD CONSTRAINT `ProductOnOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductOnOrder_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
