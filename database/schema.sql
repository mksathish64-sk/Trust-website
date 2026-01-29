-- Create Database
CREATE DATABASE IF NOT EXISTS trust_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trust_db;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    full_description TEXT,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    display_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcements/Events Table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('announcement', 'event') DEFAULT 'announcement',
    event_date DATE NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'responded') DEFAULT 'new',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    year INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (password: admin123)
-- Password is hashed using bcryptjs with 10 salt rounds
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Z8W4uRUOZMqOKJjW9K7.8VfVuTnqG', 'admin@trust.org');

-- Insert sample data
INSERT INTO programs (title, description, full_description) VALUES 
('Education Program', 'Supporting children\'s education in rural areas', 'Our education program provides scholarships, books, and learning materials to underprivileged children in rural communities. We believe every child deserves quality education.'),
('Healthcare Initiative', 'Free medical camps and health awareness', 'We organize regular medical camps providing free health checkups, medicines, and health awareness programs in underserved areas.'),
('Skill Development', 'Vocational training for youth', 'Our skill development program offers vocational training in various trades to help youth gain employment and become self-reliant.');

INSERT INTO announcements (title, content, type, status) VALUES 
('Welcome to Trust Website', 'We are committed to serving the community and making a positive impact in people\'s lives.', 'announcement', 'active'),
('Annual Day Celebration', 'Join us for our annual day celebration on February 15, 2026.', 'event', 'active');
