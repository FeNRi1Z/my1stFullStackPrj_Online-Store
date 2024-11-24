-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2024 at 04:59 AM
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
(19, 'Andrew Kim');

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
(21, 'Finance');

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
(1, 2, 7408, 'Shipped', 'The order has shipped, you can follow up with the parcel code', 'Street:  112 Soi On-Nut 13 City:   Bangkok State/province/area:    Bangkok Zip code:  10250 Country:  Thailand', '0347376343', '2024-11-20 19:27:52.819', '2024112411812992.jpg', '2024-11-23 18:18:09.000', 'EF582621151TH'),
(2, 4, 1202, 'In Progress', 'Confirmed your payment, your order is being processed', 'Street:  292/11-2 Larnluang Si Yaek Mahanak City:  Dusit State/province/area:    Bangkok Zip code:  10300 Country:  Thailand', '0445364354', '2024-11-21 15:07:20.673', '2024112411645705.jpg', '2024-11-23 18:05:11.000', NULL);

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
(1, 'Echoes of Silence', 234, 569, 297, '20241121223840174.png', 'use', 'A haunting tale of personal discovery and emotional resilience.', 8),
(2, 'The Science of Success', 235, 500, 244, '20241121223848471.png', 'use', 'Evidence-based approaches to personal and professional achievement.', 4),
(3, 'Quantum Horizon', 1200, 1400, 280, '20241121223856232.png', 'use', 'A mind-bending journey through the frontiers of quantum physics.', 3),
(4, 'Coding Masterclass', 417, 575, 357, '2024112122390781.png', 'use', 'Comprehensive guide to modern programming techniques and best practices.', 11),
(5, 'Emotional Intelligence', 234, 333, 564, '2024112122397749.png', 'use', 'Practical strategies for understanding and improving emotional awareness.', 7),
(6, 'Echoes of Silence 2', 1156, 1300, 101, '20241121223916898.png', 'use', 'A new haunting tale of personal discovery and more emotional resilience.', 8),
(7, 'The Digital Revolution', 776, 863, 110, '20241121223923171.png', 'use', 'Exploring the transformative impact of technology on modern society.', 4),
(8, 'Shadows of Yesterday', 804, 900, 235, '20241121223927889.png', 'use', 'A gripping mystery that unravels decades-old secrets.', 6),
(9, 'The Secrets of the Universe', 120, 250, 55, '2024112122417140.png', 'use', 'An intriguing exploration of the cosmos and the mysteries it holds.', 12),
(10, 'Mastering Python', 180, 350, 45, '20241121224224241.jpg', 'use', 'A comprehensive guide for programmers to master Python programming.', 14),
(11, 'The Art of Mindfulness', 90, 150, 75, '20241121224329336.png', 'use', 'Learn techniques to achieve a peaceful and mindful life.', 15),
(12, 'Adventures in Wonderland', 110, 220, 48, '202411221121343.png', 'use', 'A thrilling fantasy novel that takes you on an extraordinary journey.', 16),
(13, 'History\'s Greatest Empires', 150, 250, 76, '2024112401919775.png', 'use', 'An insightful look into the rise and fall of some of the greatest empires in history.', 17),
(14, 'Culinary Delights', 100, 200, 44, '2024112401837506.png', 'use', 'A cookbook filled with recipes from around the world.', 18),
(15, 'The Financial Roadmap', 120, 220, 267, '2024112402640619.png', 'use', 'Your guide to financial independence and wealth-building strategies.', 19);

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
(15, 21);

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
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productonorder`
--

INSERT INTO `productonorder` (`orderId`, `productId`, `productPrice`, `quantity`) VALUES
(1, 3, 1400, 2),
(1, 4, 575, 3),
(1, 7, 863, 1),
(1, 8, 900, 2),
(1, 12, 220, 1),
(2, 1, 569, 1),
(2, 5, 333, 1),
(2, 11, 150, 2);

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
(2, 'Client01', 'c01', 'c01', 'client', 'use', 'Street:  112 Soi On-Nut 13\nCity:   Bangkok\nState/province/area:    Bangkok\nZip code:  10250\nCountry:  Thailand', '0224925138', 'noIMGFile', 0, 0),
(3, 'Client02', 'c02', 'c02', 'client', 'use', 'Street:  120/11 Moo 3, San Klang, San Kam Phaeng\nCity:   San Kam Phaeng\nState/province/area:    Chiang Mai\nZip code:  50130\nCountry:  Thailand', '0533383956', 'noIMGFile', 0, 0),
(4, 'Client03', 'c03', 'c03', 'client', 'use', 'Street:  292/11-2 Larnluang Si Yaek MahanakCity:  DusitState/province/area:    BangkokZip code:  10300 Country:  Thailand', '0228299157', 'noIMGFile', 0, 0),
(5, 'Client04', 'c04', 'c04', 'client', 'delete', 'Street:  52/53 Sukhumvit Khlong Toei Khlong Toei\nCity:  Long\nState/province/area:    Bangkok\nZip code:  10110\nCountry:  Thailand', '0262555171', 'noIMGFile', 0, 0);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
