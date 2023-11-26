const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require ('pug');
const app = express();
const port = 3000;

var conString = "postgres://vasmuvxx:qXEbAFACkOoUYUyqq3lTowTWP_WDxj70@berry.db.elephantsql.com/vasmuvxx" //Can be found in the Details page
var pool = new pg.Client(conString);
pool.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  pool.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
   
  });
});



app.set('view engine', 'pug');
app.use(express.static('public'));



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });