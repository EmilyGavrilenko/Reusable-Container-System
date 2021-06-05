
### The Alien Reader system connects to a SQL database for managing the reusable container system.
#### Follow the instructions below to set up a new SQL server.

1. Create a mySQL database. It can either be hosted on a local computer or on a cloud server.
	- Here's a [tutorial](https://aws.amazon.com/getting-started/hands-on/create-mysql-db/) on how to set up a mySQL DB hosted on AWS
2. Connect to the database. This can be done directly through the AWS console or with an outside application such as [Toad](https://www.toadworld.com/downloads#mysql).
3.  Once you've connected, run the code in create-tables.sql to create the required tables for the reusable container system. This will create the following three tables:
	- Users: Keeps track of all the users in the system
	- Containers: Keeps track of all the reusable food containers
	- Transactions: Contains all the checkin and checkout data for the containers and links each transaction to a user
4. Once the tables are created, run the code in permissions.sql to create a default user assessable from all IP addresses. Make sure you use the database name created in step 1 in place of *reusable_containers*
5. Optional: Run users.sql and containers.sql to populate the tables with mock data