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

async function RegisterMember(username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber){
    return await pool.query('INSERT INTO Members (username, password, Fname, Lname, Email, Street, PCode, HomeNum, Gender, DOB, PhoneNumber, JoinDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE)',
    [username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}

// Route for handling registration form submission
app.post('/MemberRegister', async (req, res) => {
    //parsing the values entered in text boxes in the registration page into variables
    const { username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber } = req.body;
    try {
        // Insert user details into the Members table
        await RegisterMember(username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber);
        // Retrieve the newly registered member
        const result = await LoginMember(username, password);
        //have to check if the user registered an account with a username not found in the database by seeing if result>0
        if (result.rowCount > 0) {
            // Redirect to the member profile page and pass the Member object to use it in pug file
            res.render('memberProfile', { Member: result.rows[0] });
        } else {
            console.log('Error retrieving registered user information');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        // Handle the error appropriately
    }
});

// Route for the members page
app.get('/MemberLogin', (req, res) => {
    res.render('MemberLogin');
});

async function LoginMember(username, password){
    
    return await pool.query('SELECT * FROM Members WHERE username = $1 AND password = $2', [username, password])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}
  // Route for handling login form submission
app.post('/MemberLogin', async (req, res) => {
    
    const { username, password } = req.body;
  
   try{
    let result = await LoginMember(username, password);
    //check if the user entered valid credentials by checking if the result returned by the SELECT query contains data
    //check if length of result >0
    if (result.rowCount >0){
        
        //if credentials are valid, it renders the Member profile pug page and gives it the Member data
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

// Route for the members page
app.get('/TrainerLogin', (req, res) => {
    res.render('TrainerLogin');
});

async function LoginTrainer(username, password){
    
    return await pool.query('SELECT * FROM Trainers WHERE username = $1 AND password = $2', [username, password])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}

async function getTrainerSessions(TrainerID){
    try {
        const result = await pool.query('SELECT * FROM TrainingSessions WHERE trainerid = $1 ORDER BY SessionDate, SessionTime DESC', [TrainerID]);
        
        return result.rows;
    } catch (error) {
        
        throw error; // rethrow the error to be caught in the calling function
    }
}

//function to get the training sessions that are completed. 
//A session is completed if the current date and time is >= the sessions date, time, duration
async function getCompletedSessions(TrainerID){
    try {
         
        result = await pool.query('SELECT * FROM TrainingSessions WHERE trainerid = $1 AND (SELECT current_date) + (SELECT current_time) >= sessiondate + sessiontime + duration', [TrainerID]);
        console.log(result.rows[0]);
        return result.rows;
    } catch (error) {
        
        throw error; // rethrow the error to be caught in the calling function
    }
}

async function addProgressNotes(TrainerID, SessionID, ProgressNotes){
    try {
         
        result = await pool.query('UPDATE TrainingSessions SET progressNotes = COALESCE(progressNotes, $1) WHERE sessionID = $2 AND trainerID = $3 AND (SELECT current_date) + (SELECT current_time) >= (sessionDate + sessionTime + duration) AND progressNotes IS NULL', [ProgressNotes, SessionID, TrainerID]);
        console.log(result.rows[0]);
        return result.rows;
    } catch (error) {
        
        throw error; // rethrow the error to be caught in the calling function
    }
    
}
async function getTrainerEvents(TrainerID){
    try {
        const result = await pool.query('SELECT * FROM Event WHERE trainerid = $1 ORDER BY EventDate, EventTime DESC', [TrainerID]);
        return result.rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    }
}

app.post('/addProgressNotes', async (req, res) => {
    const { SessionID, progressNotes, TrainerID } = req.body;

    try {
        // Call the function to update progress notes
        await addProgressNotes(TrainerID, SessionID, progressNotes);

        // Redirect back to the TrainerProfile page with updated data
        let TrainingSessions = await getTrainerSessions(TrainerID);
        let events = await getTrainerEvents(TrainerID);
        let completedSess = await getCompletedSessions(TrainerID);

        res.render('TrainerProfile', { Trainer: { trainerid: TrainerID }, Sessions: TrainingSessions, Events: events, completedSess: completedSess });
    } catch (error) {
        console.error('Error adding progress notes:', error);
        // Handle the error appropriately
        res.render('errorPage', { ErrorMessage: 'Error adding progress notes' });
    }
});


  // Route for handling login form submission
app.post('/Trainerlogin', async (req, res) => {
    
    const { username, password } = req.body;

   try{

    let result = await LoginTrainer(username, password);
    
    let TrainingSessions = await getTrainerSessions(result.rows[0].trainerid);
    let events = await getTrainerEvents(result.rows[0].trainerid);
    let completedSess = await getCompletedSessions(result.rows[0].trainerid);
    
    //check if the user entered valid credentials by checking if the result returned by the SELECT query contains data
    //check if length of result >0
    if (result.rowCount >0){
        //if credentials are valid, it renders the Trainer profile pug page and gives it the Trainer data
        res.render('TrainerProfile', {Trainer: result.rows[0], Sessions: TrainingSessions, Events: events, completedSess: completedSess});
    }
    else{
        console.log('Login credentials are incorrect');
        res.render('TrainerLogin', {ErrorMessage: 'Login credentials are incorrect'});
        
    }
   }catch(error){

   }
    
});
  





process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, rethrow, etc.
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});