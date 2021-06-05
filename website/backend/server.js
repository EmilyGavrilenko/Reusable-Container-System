const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");

const app = express();
app.use(cors());
app.use(function(req, res, next) {
    req.rawBody = '';
    req.setEncoding('utf8');
  
    req.on('data', function(chunk) { 
      req.rawBody += chunk;
    });
  
    req.on('end', function() {
      next();
    });
  });
app.use(bodyParser());

var website = require('./website')
var reader = require('./reader')

app.use('/api', website)
app.use('/alien', reader)

app.get('/', (req, res) => {
    res.send('Successfully connected to the Reusable Container System Backend.')
})

app.post('/', (req, res) => {
    console.log(req.body)
    let date = new Date()
    console.log("Received data at: " + date)
    res.send('Successfully received tag data.')
})


app.get("/status", (req, res) => res.send("Working!"));

if (process.argv.includes('dev')) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

module.exports = app;

