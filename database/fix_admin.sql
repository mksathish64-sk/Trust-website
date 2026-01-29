-- Fix admin password
USE trust_db;
UPDATE admins SET password = '$2a$10$cNytyQa5rRZnfm4AwutxB.LmdqAB8kfXFVZhtfSvpqQzA7eIqL.e2' WHERE username = 'admin';
SELECT 'Password updated successfully' as status;
