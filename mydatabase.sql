-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2025 at 12:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS urbaniaDB;
USE urbaniaDB;  -- ✅ This ensures MySQL knows which database to use

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `notification_method` varchar(20) NOT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menuitem`
--

CREATE TABLE `menuitem` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` float NOT NULL,
  `picture` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menuitem`
--

INSERT INTO `menuitem` (`id`, `name`, `category`, `price`, `picture`, `description`) VALUES
(17, 'Café Espresso', 'breuvages', 4, 'espresso.png', 'Un espresso corsé pour les amateurs de café intense.'),
(18, 'Café Latte', 'breuvages', 4.5, 'latte.png', 'Un latte onctueux agrémenté d\'une mousse légère.'),
(19, 'Cappuccino', 'breuvages', 4, 'cappuccino.png', 'Un cappuccino équilibré avec une mousse dense et crémeuse.'),
(20, 'Thé Vert Bio', 'breuvages', 3, 'the_vert.png', 'Thé vert biologique aux notes rafraîchissantes, idéal pour se détendre.'),
(21, 'Jus d\'Orange Frais', 'breuvages', 4.2, 'jus_orange.png', 'Jus d\'orange pressé à la main, riche en vitamines.'),
(22, 'Smoothie Fraise-Banane', 'breuvages', 5, 'smoothie.png', 'Smoothie onctueux à base de fraises fraîches et de banane.'),
(23, 'Chocolat Chaud', 'breuvages', 4.8, 'chocolat_chaud.png', 'Chocolat chaud riche et crémeux, parfait pour les jours froids.'),
(24, 'Limonade Maison', 'breuvages', 3.8, 'limonade.png', 'Limonade rafraîchissante préparée avec des citrons frais.'),
(25, 'Sandwich au Poulet', 'plats', 7.5, 'sandwich_poulet.png', 'Sandwich garni de poulet grillé, laitue et tomate sur pain frais.'),
(26, 'Salade Niçoise', 'plats', 8, 'salade_nicoise.png', 'Salade composée de thon, œufs, olives, tomates et haricots verts.'),
(27, 'Quiche Lorraine', 'plats', 6.5, 'quiche_lorraine.png', 'Quiche traditionnelle aux lardons, œufs et crème, servie tiède.'),
(28, 'Pâtes à la Carbonara', 'plats', 9, 'pates_carbonara.png', 'Pâtes savoureuses à la sauce carbonara crémeuse et relevées d\'un soupçon de poivre.'),
(29, 'Burger Végétarien', 'plats', 8.5, 'burger_vegetarien.png', 'Burger à base de galette végétarienne, garni de légumes frais et sauce spéciale.'),
(30, 'Tarte aux Pommes', 'plats', 5.5, 'tarte_aux_pommes.png', 'Tarte croustillante aux pommes caramélisées et une pointe de cannelle.'),
(31, 'Wrap au Thon', 'plats', 7.8, 'wrap_thon.png', 'Wrap léger au thon, accompagné de légumes croquants et d\'une sauce yaourt.'),
(32, 'Salade César', 'plats', 8.2, 'salade_cesar.png', 'Salade César classique avec poulet grillé, croûtons et parmesan.'),
(33, 'Pâté chinois', 'plats', 7, 'pate_chinois.png', 'Plat traditionnel québécois composé de viande hachée, de maïs et de purée de pommes de terre.'),
(34, 'Tourtière', 'plats', 8.5, 'tourtiere.png', 'Une tourtière savoureuse avec un mélange d\'épices et de viande finement hachée.'),
(35, 'Fèves au lard', 'plats', 6, 'feves_au_lard.png', 'Fèves mijotées avec du lard fumé et des épices, un classique du Québec.'),
(36, 'Cipaille', 'plats', 9.5, 'cipaille.png', 'Plat en couches traditionnel, riche en saveurs et en histoire, préparé avec plusieurs viandes.'),
(37, 'Pouding chômeur', 'plats', 5, 'pouding_chomeur.png', 'Dessert réconfortant combinant un gâteau moelleux et du sirop d\'érable, emblématique du Québec.');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `card_number` varchar(20) NOT NULL,
  `items` varchar(255) NOT NULL,
  `total_price` float NOT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menuitem`
--
ALTER TABLE `menuitem`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`password`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menuitem`
--
ALTER TABLE `menuitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
