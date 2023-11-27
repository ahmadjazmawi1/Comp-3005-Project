const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require ('pug');
const app = express();
const port = 3000;
const pg = require('pg');

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



// ...

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.use(express.static('public'));

// Route for the main page
app.get('/', (req, res) => {
    res.render('main');
  });
// Route for the members page
app.get('/MemberLogin', (req, res) => {
    res.render('MemberLogin');
});

async function LoginMember(username, password){
    console.log("username " + username + " password " + password);
    return await pool.query('SELECT * FROM Members WHERE username = $1 AND password = $2', [username, password])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}
  // Route for handling login form submission
app.post('/login', async (req, res) => {
    
    const { username, password } = req.body;
  
   try{
    console.log('Before LoginMember');
    let result = await LoginMember(username, password);
    
    console.log('After LoginMember');
    if (result.rowCount >0){
        console.dir(result.rows, { depth: null });
        console.log("Fname: " + result.rows[0].fname);
        console.log("Lname: " + result.rows[0].Lname);
        console.log('Redirecting to /MemberProfile');
        res.render('MemberProfile', {Member: result.rows[0]});
    }
    else{
        console.log('Login credentials are incorrect');
        res.render('MemberLogin', {ErrorMessage: 'Login credentials are incorrect'});
        
    }
   }catch(error){

   }
    
});
  
  // Route for the registration page
app.get('/MemberRegister', (req, res) => {
    res.render('MemberRegister'); 
});

async function RegisterMember(username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber){
    return await pool.query('INSERT INTO Members (username, password, Fname, Lname, Email, Street, PCode, HomeNum, Gender, DOB, PhoneNumber, JoinDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE)',
    [username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}
  // Route for handling registration form submission
app.post('/register', async (req, res) => {
   
   
    const { username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber } = req.body;
    // Insert user details into the Members table
    try {
        await RegisterMember(username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber);
        console.log('User registered successfully');
        //res.render('MemberProfile', {Member: })
        
        res.render('MemberProfile');
    } catch (error) {
        console.error('Error registering user:', error);
       
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, rethrow, etc.
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });