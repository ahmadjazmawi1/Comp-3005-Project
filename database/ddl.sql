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


CREATE TABLE Workshop (
    WorkshopName VARCHAR(255) NOT NULL

)INHERITS (Event);

CREATE TABLE OtherEvent (
	EventName VARCHAR(255) NOT NULL
)INHERITS (Event);

CREATE TABLE Exercise_Routine (
    MemberID INT PRIMARY KEY,
    Exercise_Routine TEXT NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);

CREATE TABLE Fitness_Goals (
    MemberID INT PRIMARY KEY,
    Fitness_Goals TEXT NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);

CREATE TABLE Health_Metrics (
    MemberID INT PRIMARY KEY,
    Health_Metrics TEXT NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);

CREATE TABLE Billing1 (
    BillingID INT PRIMARY KEY,
    Amount INT NOT NULL, 
    Billing1Date DATE NOT NULL,
    Billing1Description TEXT,
    BillingType TEXT NOT NULL,
    Billing1Status INT NOT NULL,
    EventID INT NOT NULL,
    SessionID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Event (EventID),
    FOREIGN KEY (SessionID) REFERENCES TrainingSessions (SessionID)
);

CREATE TABLE Loyalty_Points (
    LoyaltyID SERIAL PRIMARY KEY,
    numPoints INT NOT NULL,
    MemberID INT NOT NULL,
	FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);

CREATE TABLE Payment1 (
    PaymentID INT NOT NULL,
    LoyaltyID INT NOT NULL,
    pointsEarned INT NOT NULL,
    pointsRedeemed INT NOT NULL,
	PRIMARY KEY (PaymentID, LoyaltyID),
    FOREIGN KEY (LoyaltyID) REFERENCES Loyalty_Points (LoyaltyID)
);

CREATE TABLE Payment2 (
    PaymentID INT PRIMARY KEY,
    BillingID INT NOT NULL,
    PaymentDate2      Date NOT NULL,
    FOREIGN KEY (BillingID) REFERENCES Billing1 (BillingID)
);

CREATE TABLE Payment3 (
    BillingID INT PRIMARY KEY,
    StaffID  INT NOT NULL,
    MemberID INT NOT NULL,
    PaymentDescription3 TEXT,
    FOREIGN KEY (BillingID) REFERENCES Billing1 (BillingID),
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID),
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);




CREATE TABLE Billing2 (
    EventID INT PRIMARY KEY,
    StaffID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Event (EventID),
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID)
);

CREATE TABLE Billing3 (
    SessionID INT PRIMARY KEY,
    MemberID INT NOT NULL,
	StaffID INT NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID),
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID)
);


CREATE TABLE ViewsProfile (
    MemberID INT NOT NULL,
    TrainerID INT NOT NULL,
    Primary KEY (MemberID, TrainerID),
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID),
    FOREIGN KEY (TrainerID) REFERENCES Trainers (TrainerID)
);

CREATE TABLE ScheduleEvent (
    MemberID INT NOT NULL,
    EventID INT NOT NULL,
    PRIMARY KEY (MemberID, EventID),
    FOREIGN KEY (MemberID) REFERENCES Members (MemberID),
    FOREIGN KEY (EventID) REFERENCES Event (EventID)
);

CREATE TABLE FitnessEquipmentMaintenance(
    MaintenanceID SERIAL PRIMARY KEY,
    EquipmentName VARCHAR(255) NOT NULL,
    MaintenanceDate DATE NOT NULL,
    MaintenanceDescription TEXT NOT NULL,
    StaffID INT NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID)

);

CREATE TABLE QualityAssurance (
    QAID SERIAL PRIMARY KEY,
    Evaluation TEXT NOT NULL,
    Feedback TEXT NOT NULL,
    StaffID INT NOT NULL, 
    FOREIGN KEY (StaffID) REFERENCES AdminStaff (StaffID)
);