-- Data Definiton Queries for Student Information Database Project
-- By Sheng Bian
--
-- Table structure for table `student`
--
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `number` int(10) NOT NULL,
  `programCode` varchar(8) NOT NULL,
  `isInternational` BOOLEAN NOT NULL DEFAULT 0,
  `collegeId` int(8) NOT NULL,
  `balance` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `program`
--
DROP TABLE IF EXISTS `program`;
CREATE TABLE `program` (
  `programCode` varchar(8) NOT NULL,
  `name` varchar(100) NOT NULL,
  `college` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `person`
--
DROP TABLE IF EXISTS `person`;
CREATE TABLE `person` (
  `number` int(10) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `birthdate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `student_course`
--
DROP TABLE IF EXISTS `student_course`;
CREATE TABLE `student_course` (
  `studentNumber` int(10) NOT NULL,
  `courseCode` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  
 
--
-- Table structure for table `course`
--
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `courseCode` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hours` int(2) NOT NULL,
  `credits` int(1) NOT NULL DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `payment`
--
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `studentNumber` int(10) NOT NULL,
  `invoiceNumber` int(12) NOT NULL,
  `transactionDate` date NOT NULL,
  `amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`number`),
  ADD KEY `programCode` (`programCode`); 
  
--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`number`);

  
--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`courseCode`);


--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`programCode`),
  ADD UNIQUE KEY `name` (`name`);
  
--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ADD KEY `studentNumber` (`studentNumber`);
  
--
-- Indexes for table `student_course`
--
ALTER TABLE `student_course`
  ADD `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ADD KEY `studentNumber` (`studentNumber`),
  ADD KEY `courseCode` (`courseCode`);
  
  
--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`programCode`) REFERENCES `program` (`programCode`);
 
 
--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `person_ibfk_1` FOREIGN KEY (`number`) REFERENCES `student` (`number`);

   
--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`studentNumber`) REFERENCES `student` (`number`);


--
-- Constraints for table `student_course`
--
ALTER TABLE `student_course`
  ADD CONSTRAINT `student_course_ibfk_1` FOREIGN KEY (`studentNumber`) REFERENCES `student` (`number`),
  ADD CONSTRAINT `student_course_ibfk_2` FOREIGN KEY (`courseCode`) REFERENCES `course` (`courseCode`);


--
-- Dumping data for table `program`
--

INSERT INTO `program` (`programCode`, `name`, `college`) VALUES
('CS', 'Computer Science', 'Engineering'),
('IS', 'Information System', 'Engineering'),
('BA', 'Business Administration', 'Business');
 
--
-- Dumping data for table `student`
--

INSERT INTO `student` (`number`, `programCode`, `isInternational`, `collegeId`, `balance`) VALUES
(1234567890, 'CS', '1', 12345671, 523.3),
(1234567891, 'CS', '1', 12345672, -100),
(1234567892, 'BA', '0', 12345673, 20),
(1234567893, 'BA', '0', 12345674, 6965),
(1234567894, 'IS', '1', 12345675, 0);

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`number`, `lastName`, `firstName`, `phoneNumber`, `email`, `birthdate`) VALUES
(1234567890, 'Adama', 'Tom', '22685698365', 'Tom@gmail.com', '1995-09-08'),
(1234567891, 'Hoover', 'Jones', '22685698366', 'Jones@gmail.com', '1995-11-08'),
(1234567892, 'Hoover', 'Lucy', '22685698367', 'Lucy@gmail.com', '1996-01-08'),
(1234567893, 'Adama', 'Lee', '22685698368', 'Lee@gmail.com', '1995-09-25'),
(1234567894, 'Adama', 'Bob', '22685698369', 'Bob@gmail.com', '1995-09-30');

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`courseCode`, `name`, `hours`, `credits`) VALUES
('CS261', 'Data Structure', 60, 4),
('CS344', 'Operating Systems', 60, 4),
('CS290', 'Web Development', 60, 4),
('CS361', 'Software Engineering I', 60, 4);


--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`studentNumber`, `invoiceNumber`, `transactionDate`, `amount`) VALUES
(1234567890, 123456789123, '2017-09-08', 9965),
(1234567891, 123456789124, '2017-09-09', 52),
(1234567890, 123456789125, '2017-09-10', 796),
(1234567893, 123456789126, '2017-09-25', 412);


--
-- Dumping data for table `student_course`
--

INSERT INTO `student_course` (`studentNumber`, `courseCode`) VALUES
(1234567890, 'CS261'),
(1234567890, 'CS344'),
(1234567890, 'CS290'),
(1234567890, 'CS361'),
(1234567891, 'CS261');
