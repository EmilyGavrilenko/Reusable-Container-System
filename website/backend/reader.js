const express = require("express");
const connection = require("./database");
const router = express.Router();

// Takes in a container ID
// Creates a new container entry in the containers database if it doesn't already exist 
router.post("/add-container", async function (req, res) {
    let containerID = req.rawBody
	let data = {
		ID: containerID,
		checkedOut: '0'
	}

	let sql = "SELECT * from containers where ID = ?"

	connection.query(sql, containerID, (error, results, fields) => {
		if (error) {
			res.send(error)
			return false;
		}
		if (results.length == 0) {
			sql = "INSERT INTO containers SET ?"

			connection.query(sql, data, function (error, results, fields) {
				if (error) throw error;
					res.json(results);
				}
			);
		}
		else {
			res.send("Container already exists")
		}
		
	});
});

// Takes in a container ID
// Creates a new transaction returning the container if it's currently checked out
router.post('/checkin', (req, res) => {
    let containerID = req.rawBody

	let sql = "SELECT * from containers where ID = ?"

	connection.query(sql, containerID, (error, results, fields) => {
		if (error) {
			res.send(error)
			return false;
		}
		if (results.length == 0) {
			res.send("container doesn't exist")
		}
		else {
			let container = results[0]
			if (container.checkedOut == '1') {
				sql = "SELECT * FROM transactions WHERE container = ? ORDER BY `datetime` desc LIMIT 1"
				connection.query(sql, containerID, function (error, results, fields) {
					if (error) throw error;
					let user = results[0].user
					let date = new Date().toLocaleString().slice(0, 19).replace('T', ' ')
					let new_transaction = {
						user: user,
						container: containerID,
						datetime: date,
						checkedOut: '0'
					}
					sql = 'INSERT INTO transactions SET ? '
					connection.query(sql, new_transaction, function (error, results, fields) {
						if (error) throw error;
					});
				});
				res.send("Container successfully checked out")
				console.log("Can return container")
				return;
			}
			res.send("Container already exists")
		}
		
	});

    console.log(containerID)
})

module.exports = router;

