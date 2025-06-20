-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: clinic_registration
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `day_of_week` varchar(10) NOT NULL,
  `time_period` varchar(10) NOT NULL,
  `available` tinyint(1) DEFAULT '1',
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `fk_schedule_created_by` (`created_by`),
  CONSTRAINT `fk_schedule_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'星期一','上午',1,NULL),(2,1,'星期三','上午',1,NULL),(3,1,'星期五','上午',1,NULL),(4,2,'星期二','下午',1,NULL),(5,2,'星期四','下午',1,NULL),(6,2,'星期六','下午',1,NULL),(7,3,'星期一','上午',1,NULL),(8,3,'星期三','上午',1,NULL),(9,3,'星期五','上午',1,NULL),(10,4,'星期二','下午',1,NULL),(11,4,'星期四','下午',1,NULL),(12,4,'星期六','下午',1,NULL),(13,5,'星期一','上午',1,NULL),(14,5,'星期三','上午',1,NULL),(15,5,'星期五','上午',1,NULL),(16,6,'星期二','下午',1,NULL),(17,6,'星期四','下午',1,NULL),(18,6,'星期六','下午',1,NULL),(19,7,'星期一','上午',1,NULL),(20,7,'星期三','上午',1,NULL),(21,7,'星期五','上午',1,NULL),(22,8,'星期二','下午',1,NULL),(23,8,'星期四','下午',1,NULL),(24,8,'星期六','下午',1,NULL),(25,9,'星期一','上午',1,NULL),(26,9,'星期三','上午',1,NULL),(27,9,'星期五','上午',1,NULL),(28,10,'星期二','下午',1,NULL),(29,10,'星期四','下午',1,NULL),(30,10,'星期六','下午',1,NULL),(31,11,'星期一','上午',1,NULL),(32,11,'星期三','上午',1,NULL),(33,11,'星期五','上午',1,NULL),(34,12,'星期二','下午',1,NULL),(35,12,'星期四','下午',1,NULL),(36,12,'星期六','下午',1,NULL),(37,13,'星期一','上午',1,NULL),(38,13,'星期三','上午',1,NULL),(39,13,'星期五','上午',1,NULL),(40,14,'星期二','下午',1,NULL),(41,14,'星期四','下午',1,NULL),(42,14,'星期六','下午',1,NULL),(43,15,'星期一','上午',1,NULL),(44,15,'星期三','上午',1,NULL),(45,15,'星期五','上午',1,NULL),(46,16,'星期二','下午',1,NULL),(47,16,'星期四','下午',1,NULL),(48,16,'星期六','下午',1,NULL),(49,17,'星期一','上午',1,NULL),(50,17,'星期三','上午',1,NULL),(51,17,'星期五','上午',1,NULL),(52,18,'星期二','下午',1,NULL),(53,18,'星期四','下午',1,NULL),(54,18,'星期六','下午',1,NULL),(55,19,'星期一','上午',1,NULL),(56,19,'星期三','上午',1,NULL),(57,19,'星期五','上午',1,NULL),(58,20,'星期二','下午',1,NULL),(59,20,'星期四','下午',1,NULL),(60,20,'星期六','下午',1,NULL),(61,21,'星期一','上午',1,NULL),(62,21,'星期三','上午',1,NULL),(63,21,'星期五','上午',1,NULL),(64,22,'星期二','下午',1,NULL),(65,22,'星期四','下午',1,NULL),(66,22,'星期六','下午',1,NULL),(67,23,'星期一','上午',1,NULL),(68,23,'星期三','上午',1,NULL),(69,23,'星期五','上午',1,NULL),(70,24,'星期二','下午',1,NULL),(71,24,'星期四','下午',1,NULL),(72,24,'星期六','下午',1,NULL),(73,25,'星期一','上午',1,NULL),(74,25,'星期三','上午',1,NULL),(75,25,'星期五','上午',1,NULL),(76,26,'星期二','下午',1,NULL),(77,26,'星期四','下午',1,NULL),(78,26,'星期六','下午',1,NULL),(79,27,'星期一','上午',1,NULL),(80,27,'星期三','上午',1,NULL),(81,27,'星期五','上午',1,NULL),(82,28,'星期二','下午',1,NULL),(83,28,'星期四','下午',1,NULL),(84,28,'星期六','下午',1,NULL),(85,29,'星期一','上午',1,NULL),(86,29,'星期三','上午',1,NULL),(87,29,'星期五','上午',1,NULL),(88,30,'星期二','下午',1,NULL),(89,30,'星期四','下午',1,NULL),(90,30,'星期六','下午',1,NULL),(91,31,'星期一','上午',1,NULL),(92,31,'星期三','上午',1,NULL),(93,31,'星期五','上午',1,NULL),(94,32,'星期二','下午',1,NULL),(95,32,'星期四','下午',1,NULL),(96,32,'星期六','下午',1,NULL),(97,33,'星期一','上午',1,NULL),(98,33,'星期三','上午',1,NULL),(99,33,'星期五','上午',1,NULL),(100,34,'星期二','下午',1,NULL),(101,34,'星期四','下午',1,NULL),(102,34,'星期六','下午',1,NULL),(103,35,'星期一','上午',1,NULL),(104,35,'星期三','上午',1,NULL),(105,35,'星期五','上午',1,NULL),(106,36,'星期二','下午',1,NULL),(107,36,'星期四','下午',1,NULL),(108,36,'星期六','下午',1,NULL),(109,37,'星期一','上午',1,NULL),(110,37,'星期三','上午',1,NULL),(111,37,'星期五','上午',1,NULL),(112,38,'星期二','下午',1,NULL),(113,38,'星期四','下午',1,NULL),(114,38,'星期六','下午',1,NULL),(125,2,'星期一','上午',1,NULL),(153,1,'星期六','上午',1,1);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17 14:37:30
