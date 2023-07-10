-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2023 at 06:02 AM
-- Server version: 8.0.33-0ubuntu0.22.04.2
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `volunteer`
--

-- --------------------------------------------------------

--
-- Table structure for table `accept_status`
--

CREATE TABLE `accept_status` (
  `aid` int NOT NULL,
  `rid` int NOT NULL,
  `email` varchar(177) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accept_status`
--

INSERT INTO `accept_status` (`aid`, `rid`, `email`) VALUES
(23, 23, 'shaikrehammtullah2003@gmail.com'),
(24, 26, 'dbmsproject09@gmail.com'),
(25, 24, 'shaikrehammtullah2003@gmail.com'),
(26, 28, 'shaikrehammtullah2003@gmail.com'),
(27, 29, 'shaikrehammtullah2003@gmail.com'),
(28, 30, 'shaikrehammtullah2003@gmail.com'),
(29, 27, 'shaikrehammtullah2003@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `mid` int NOT NULL,
  `rid` int NOT NULL,
  `user` varchar(777) NOT NULL,
  `message` varchar(2000) NOT NULL,
  `time` varchar(77) NOT NULL,
  `email` varchar(77) NOT NULL,
  `date` varchar(77) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`mid`, `rid`, `user`, `message`, `time`, `email`, `date`) VALUES
(28, 26, 'user', 'hi', '4:42 pm', 'shaikrehammtullah2003@gmail.com', '11-05-2023'),
(29, 26, 'dbms', 'hrllo', '4:42 pm', 'dbmsproject09@gmail.com', '11-05-2023');

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `building` varchar(77) NOT NULL,
  `house` varchar(77) NOT NULL,
  `street` varchar(77) NOT NULL,
  `city` varchar(77) NOT NULL,
  `gender` varchar(17) NOT NULL,
  `dob` varchar(17) NOT NULL,
  `email` varchar(77) NOT NULL,
  `country` varchar(77) DEFAULT NULL,
  `state` varchar(77) DEFAULT NULL,
  `image` varchar(77) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`building`, `house`, `street`, `city`, `gender`, `dob`, `email`, `country`, `state`, `image`) VALUES
('dbms', 'dbms', 'dbms', 'dbms', 'male', '2023-05-11', 'dbmsproject09@gmail.com', 'dbms', 'dbms', '1688916771878.jpg'),
('user', 'user', 'user', 'user', 'male', '2023-05-11', 'shaikrehammtullah2003@gmail.com', 'user', 'user', '1683742852485.jpg'),
('jbasj', 'jashsa', 'mnsnms', 'hjsahjsa', 'male', '2023-05-05', 'shaikshannu6300@gmail.com', 'smnamnsa', 'mnhsanms', 'user.png');

-- --------------------------------------------------------

--
-- Table structure for table `personal`
--

CREATE TABLE `personal` (
  `about` varchar(177) NOT NULL,
  `areas` varchar(77) NOT NULL,
  `activities` varchar(77) NOT NULL,
  `skills` varchar(77) NOT NULL,
  `email` varchar(77) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal`
--

INSERT INTO `personal` (`about`, `areas`, `activities`, `skills`, `email`) VALUES
('dbms', 'dbms', 'dbms', 'dbms', 'dbmsproject09@gmail.com'),
('user', 'user', 'user', 'user', 'shaikrehammtullah2003@gmail.com'),
('ho', 'ho', 'ho', 'ho', 'shaikshannu6300@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE `register` (
  `name` varchar(77) NOT NULL,
  `email` varchar(77) NOT NULL,
  `aadhar` varchar(77) NOT NULL,
  `password` varchar(77) NOT NULL,
  `phone` varchar(17) NOT NULL,
  `postal` varchar(17) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`name`, `email`, `aadhar`, `password`, `phone`, `postal`) VALUES
('dbms dbms', 'dbmsproject09@gmail.com', '777777777777', 'dbmsproject09', '7777777777', '777'),
('user user', 'shaikrehammtullah2003@gmail.com', '777777777777', '4444444444', '7777777777', '777'),
('hi hi', 'shaikshannu6300@gmail.com', '777777777777', '789456123', '7777777777', '777');

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `rid` int NOT NULL,
  `email` varchar(77) DEFAULT NULL,
  `message` varchar(777) DEFAULT NULL,
  `tag1` varchar(77) DEFAULT NULL,
  `tag2` varchar(77) DEFAULT NULL,
  `subject` varchar(77) DEFAULT NULL,
  `accept` varchar(77) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `chat` varchar(77) NOT NULL DEFAULT '0',
  `name` varchar(77) DEFAULT NULL,
  `image` varchar(77) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `request`
--

INSERT INTO `request` (`rid`, `email`, `message`, `tag1`, `tag2`, `subject`, `accept`, `chat`, `name`, `image`) VALUES
(23, 'dbmsproject09@gmail.com', 'dbms', '#dbms', '#dbms', 'dbms', '1', '0', 'dbms dbms', '1688916771878.jpg'),
(24, 'dbmsproject09@gmail.com', 'hello', '#hello', '#hello\r\n', 'hello', '1', '0', 'dbms dbms', '1688916771878.jpg'),
(25, 'dbmsproject09@gmail.com', 'hi', '#hi', '#hi', 'hi', '0', '0', 'dbms dbms', '1688916771878.jpg'),
(26, 'shaikrehammtullah2003@gmail.com', 'hi', '#hi', '#hi', 'hello', '1', '0', 'user user', '1683742852485.jpg'),
(27, 'dbmsproject09@gmail.com', 'hello', '#hello', '#hello', 'hello', '1', '0', 'hi', '1688916771878.jpg'),
(28, 'dbmsproject09@gmail.com', 'hi', '#hi', '#hi', 'hi', '1', '0', 'dbms dbms', '1688916771878.jpg'),
(29, 'dbmsproject09@gmail.com', 'hello', '#hello', '#hello', 'hello', '1', '0', 'dbms dbms', '1688916771878.jpg'),
(30, 'dbmsproject09@gmail.com', 'hello', '#hello', '#hello\r\n', 'hello', '1', '0', 'dbms dbms', '1688916771878.jpg'),
(31, 'dbmsproject09@gmail.com', 'hello', '#hello', '#hello', 'hello', '0', '0', 'dbms dbms', '1688916771878.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `you`
--

CREATE TABLE `you` (
  `ethincity` varchar(77) NOT NULL,
  `employment` varchar(77) NOT NULL,
  `disability` varchar(77) NOT NULL,
  `nationality` varchar(77) NOT NULL,
  `email` varchar(77) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `you`
--

INSERT INTO `you` (`ethincity`, `employment`, `disability`, `nationality`, `email`) VALUES
('asian', 'fully employed', 'none', 'India', 'dbmsproject09@gmail.com'),
('south asian', 'fully employed', 'none', 'India', 'shaikrehammtullah2003@gmail.com'),
('asian', 'house person', 'none', 'Argentina', 'shaikshannu6300@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accept_status`
--
ALTER TABLE `accept_status`
  ADD PRIMARY KEY (`aid`),
  ADD KEY `allltt` (`email`),
  ADD KEY `aalllt` (`rid`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`mid`),
  ADD KEY `aalt` (`email`),
  ADD KEY `allrt` (`rid`);

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `aaalt` (`email`);

--
-- Indexes for table `you`
--
ALTER TABLE `you`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accept_status`
--
ALTER TABLE `accept_status`
  MODIFY `aid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `mid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `rid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accept_status`
--
ALTER TABLE `accept_status`
  ADD CONSTRAINT `aalllt` FOREIGN KEY (`rid`) REFERENCES `request` (`rid`),
  ADD CONSTRAINT `allltt` FOREIGN KEY (`email`) REFERENCES `register` (`email`);

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `aalt` FOREIGN KEY (`email`) REFERENCES `register` (`email`),
  ADD CONSTRAINT `allrt` FOREIGN KEY (`rid`) REFERENCES `request` (`rid`);

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `alllt` FOREIGN KEY (`email`) REFERENCES `register` (`email`);

--
-- Constraints for table `personal`
--
ALTER TABLE `personal`
  ADD CONSTRAINT `ALLt` FOREIGN KEY (`email`) REFERENCES `register` (`email`);

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `aaalt` FOREIGN KEY (`email`) REFERENCES `register` (`email`);

--
-- Constraints for table `you`
--
ALTER TABLE `you`
  ADD CONSTRAINT `alt` FOREIGN KEY (`email`) REFERENCES `register` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
