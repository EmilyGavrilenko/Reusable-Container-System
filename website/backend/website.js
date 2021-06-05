const express = require("express");
const connection = require("./database");
const router = express.Router();
const moment = require('moment')


// Fetch all user, container, and transaction data from the database
router.route("/all").get(async function (req, res, next) {
  output = {}
  output["transactions"] = await getTransactions();
  output["users"] = await getUsers();
  output["containers"] = await getContainers();
  return output;
});


// Fetch all the containers from the database
router.route("/containers").get(function (req, res, next) {
  connection.query("SELECT * FROM containers",
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});


// Fetch all the users from the database
router.route("/users").get(function (req, res, next) {
  connection.query("SELECT * FROM users",
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

// Fetch all the transactions from the database
router.route("/transactions").get(function (req, res, next) {
  connection.query("SELECT * FROM transactions ORDER BY `datetime` desc",
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

// Takes in a user's first name, last name, and ID
// Creates a new user entry in the users database if it doesn't already exist 
router.route("/add-user").post(async function (req, res) {
  let body = JSON.parse(req.rawBody)

  let data = {
    ID: body.userID,
    firstName: body.firstName,
    lastName: body.lastName
  }
  console.log(data)

  let sql = "SELECT * from users where ID = ?"

  connection.query(sql, body.userID, (error, results, fields) => {
    if (error) {
      res.send(error)
      return false;
    }
    if (results.length == 0) {
      sql = "INSERT INTO users SET ?"

      connection.query(sql, data, function (error, results, fields) {
        if (error) throw error;
          res.json(results);
        }
      );
    }
    else {
      res.send("User already exists")
    }
    
  });
});

// Takes in a container ID
// Creates a new container entry in the containers database if it doesn't already exist 
router.post("/add-container", async function (req, res) {
  let body = JSON.parse(req.rawBody)
  let data = {
    ID: body.containerID,
    checkedOut: '0'
  }

  console.log(data)

  let sql = "SELECT * from containers where ID = ?"

  connection.query(sql, body.containerID, (error, results, fields) => {
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


// Takes in a container ID and a user ID
// Creates a new checkout transaction in the transactions database
router.post("/checkout-container", async function (req, res) {
  let body = JSON.parse(req.rawBody)

  let date = moment(new Date()).format().slice(0, 19).replace('T', ' ')
  let new_transaction = {
    user: body.checkoutUser,
    container: body.checkoutContainer,
    datetime: date,
    checkedOut: '1'
  }
  console.log(new_transaction)

  sql = 'INSERT INTO transactions SET ? '
  connection.query(sql, new_transaction, function (error, results, fields) {
    if (error) throw error;
    sql = 'UPDATE containers SET checkedOut = 1 WHERE ID = ?'
    connection.query(sql, body.checkoutContainer, function (error, results, fields) {
      if (error) throw error;
    })
  });

  res.send("Successfully checked out container")
});

// Takes in a container ID and a user ID
// Creates a new return transaction in the transactions database
router.post("/return-container", async function (req, res) {
  let body = JSON.parse(req.rawBody)

  let date = moment(new Date()).format().slice(0, 19).replace('T', ' ')
  let new_transaction = {
    user: body.returnUser,
    container: body.returnContainer,
    datetime: date,
    checkedOut: '0'
  }
  console.log(new_transaction)

  sql = 'INSERT INTO transactions SET ? '
  connection.query(sql, new_transaction, function (error, results, fields) {
    if (error) throw error;
    sql = 'UPDATE containers SET checkedOut = 0 WHERE ID = ?'
    connection.query(sql, body.returnContainer, function (error, results, fields) {
      if (error) throw error;
    })
  });

  res.send("Successfully checked out container")
});

// Takes in a user ID
// Returns all containers currently checked out by that user
router.post("/user-containers", async function (req, res) {
  let body = JSON.parse(req.rawBody)

  console.log(body)

  let sql = "SELECT distinct container from transactions as t join containers as c " +
            "WHERE t.user = ? and t.container = c.ID and c.checkedOut = '1'"

  connection.query(sql, body.userID, (error, results, fields) => {
    if (error) {
      res.send(error)
      return false;
    }
    res.send(results)
  });
});

function getContainers() {
  connection.query("SELECT * FROM containers",
    function (error, results, fields) {
      if (error) throw error;
      return results;
    }
  );
}

function getUsers() {
  connection.query("SELECT * FROM users",
    function (error, results, fields) {
      if (error) throw error;
      return results;
    }
  );
}

function getTransactions() {
  connection.query("SELECT * FROM transactions",
    function (error, results, fields) {
      if (error) throw error;
      return results;
    }
  );
}

module.exports = router;

