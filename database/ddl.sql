CREATE TABLE Members (
    MemberID Serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Street VARCHAR(255) NOT NULL,
    PCode VARCHAR(255) NOT NULL,
    HomeNum Int NOT NULL,
    Gender VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL,
    PhoneNumber VarChar(255) NOT NULL,
    JoinDate DATE NOT NULL



);

CREATE TABLE Trainers (
    TrainerID Serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL

);

CREATE TABLE TrainingSessions (
    SessionID Serial PRIMARY KEY,
	MemberID Int NOT NULL,
	TrainerID Int NOT NULL,
    SessionDate DATE NOT NULL,
    SessionTime Time NOT NULL,
    Duration Time NOT NULL,
    ProgressNotes TEXT, -- can be null, for ex before the session takes place
    Foreign key (MemberID) references Members (MemberID),     --id of the Member that is training
   	Foreign key (TrainerID) references Trainers (TrainerID)  -- id of the trainer that is teaching the session

);

CREATE TABLE AdminStaff(
    StaffID Serial PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL 
);

CREATE TABLE Room (
    RoomNumber INT PRIMARY KEY,
    Available BOOLEAN NOT NULL
);

CREATE TABLE Event (
    EventID Serial PRIMARY KEY,
    EventName VARCHAR(255),
	StaffID Int NOT NULL,
	RoomNumber INT NOT NULL,
	TrainerID INT NOT NULL,
    EventDate DATE NOT NULL,
    EventTime DATE NOT NULL,
    EventDuration Time NOT NULL,
    EventType VARCHAR(255),
	
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID),
    FOREIGN KEY (RoomNumber) REFERENCES Room (RoomNumber),
    FOREIGN KEY (TrainerID) REFERENCES Trainers (TrainerID),
    CONSTRAINT unique_room_date_time UNIQUE (RoomNumber, EventDate, EventTime)--we need the combination of Date, Time, 
    --and Room to be unique so that no two events can happen at the same time in the same room

);

CREATE TABLE GroupFitness(
    EventID INT PRIMARY KEY,
    FitnessTopic VARCHAR(255) NOT NULL

)INHERITS (Event);


CREATE TABLE workshop (
    WorkshopName VARCHAR(255) NOT NULL,

)


