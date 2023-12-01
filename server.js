const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const session = require('express-session');
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

// Use express-session middleware
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );





// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.use(express.static('public'));

// Route for the main page
app.get('/', (req, res) => {
    res.render('main');
  });

//registers the member
async function RegisterMember(username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber){
    //query the sql statement 
    return await pool.query('INSERT INTO Members (username, password, Fname, Lname, Email, Street, PCode, HomeNum, Gender, DOB, PhoneNumber, JoinDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE)',
    [username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}

//route for Member Profile based on their ID. Currently only used when Trainers want to view Member Profiles
app.get('/MemberProfile/:id', async (req, res) => {
    const memberId = req.params.id;

    try {
        // Query the database to get member details based on ID
        const result = await pool.query('SELECT * FROM Members WHERE memberid = $1', [memberId]);

        if (result.rowCount > 0) {
            // If member found, render the member profile page
            res.render('MemberProfile', { Member: result.rows[0] });
            const trainerId = req.session.userId; 
            await pool.query('INSERT INTO ViewsProfile (TrainerID, MemberID) VALUES ($1, $2)', [
                trainerId,
                memberId,
            ]);
        } else {
            // If member not found, render an error page or handle accordingly
            res.render('errorPage', { ErrorMessage: 'Member not found' });
        }
    } catch (error) {
        console.error('Error retrieving member profile:', error);
        // Handle the error appropriately
        res.render('errorPage', { ErrorMessage: 'Error retrieving member profile' });
    }
});
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
            req.session.userType = 'Member';
            req.session.userId = result.rows[0].memberid;
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
        req.session.userType = 'Member';
        req.session.userId = result.rows[0].memberid;
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

app.get('/AdminStaffLogin', (req, res) => {
    res.render('AdminStaffLogin');
});

async function LoginAdminStaff(username, password){
    
    return await pool.query('SELECT * FROM AdminStaff WHERE username = $1 AND password = $2', [username, password])
    .catch(error => {
        console.error('Error executing query:', error);
        throw error; // rethrow the error to be caught in the calling function
    });
   
}

async function getEquipmentMaintenance(){
    try {
        const result = await pool.query('SELECT * FROM FitnessEquipmentMaintenance');
        
        return result.rows;
    } catch (error) {
        
        throw error; // rethrow the error to be caught in the calling function
    }
}

async function EquipmentMaintenance(MaintenanceID,MaintenanceDate,MaintenanceDescription){
    try {
         
        result = await pool.query('UPDATE FitnessEquipmentMaintenance SET MaintenanceID = $1, MaintenanceDate = $2, MaintenanceDescription = $3 WHERE MaintenanceID = $1  ', [MaintenanceID,MaintenanceDate,MaintenanceDescription]);
        console.log(result.rows[0]);
        return result.rows;
    } catch (error) {
        
        throw error; // rethrow the error to be caught in the calling function
    }
    
}

app.post('/EquipmentMaintenance', async (req, res) => {
    const { MaintenanceID, MaintenanceDate, MaintenanceDescription } = req.body;
    
    try {
        // Call EquipmentMaintenance first
        await EquipmentMaintenance(MaintenanceID, MaintenanceDate, MaintenanceDescription);

        // Now you can call other asynchronous functions
        //let result = await LoginAdminStaff(username, password);
        res.render('AdminStaffLogin', {ErrorMessage: ''});

       
    } catch (error) {
        // Handle errors appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
  // Route for handling login form submission
  app.post('/AdminStaffLogin', async (req, res) => {
    
    const { username, password } = req.body;

   try{

    let result = await LoginAdminStaff(username, password);
    
    let EquipmentMaintenance = await getEquipmentMaintenance();
    //check if the user entered valid credentials by checking if the result returned by the SELECT query contains data
    //check if length of result >0
    if (result.rowCount >0){
        req.session.userType = 'AdminStaff';
        req.session.userId = result.rows[0].StaffID;
        //if credentials are valid, it renders the Trainer profile pug page and gives it the Trainer data
        res.render('AdminStaffProfile', {AdminStaff: result.rows[0], EquipmentMaintenance: EquipmentMaintenance});
    }
    else{
        console.log('Login credentials are incorrect');
        res.render('AdminStaffLogin', {ErrorMessage: 'Login credentials are incorrect'});
        
    }
   }catch(error){

   }
    
});




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

//get all the members, used for listing all the members on the Trainer Profile page so Trainers view member profiles
async function getMembers(){
    try {
        result = await pool.query('SELECT * FROM Members');
        
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
        let members = await getMembers();

        res.render('TrainerProfile', { Trainer: { trainerid: TrainerID }, Sessions: TrainingSessions, Events: events, completedSess: completedSess, Members: members});
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
    let members = await getMembers();
    
    //check if the user entered valid credentials by checking if the result returned by the SELECT query contains data
    //check if length of result >0
    if (result.rowCount >0){
        req.session.userType = 'Trainer';
        req.session.userId = result.rows[0].trainerid;
        //if credentials are valid, it renders the Trainer profile pug page and gives it the Trainer data
        res.render('TrainerProfile', {Trainer: result.rows[0], Sessions: TrainingSessions, Events: events, completedSess: completedSess, Members: members});
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