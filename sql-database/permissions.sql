-- Create a user that can be accessed from all IP addresses
CREATE USER 'user1'@'%' identified by 'my_password'
GRANT ALL PRIVILEGES ON reusable_containers.* to 'user1'@'%'
Flush Privileges

-- select * from mysql.user