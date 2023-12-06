--Training Sessions:

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-11-28', '05:15', '01:30'); 

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-11-28', '11:30', '01:30');

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-12-30', '11:30', '01:30');

--These are used in the application:
--When setting an attribute equal to something, use the variable used in the server.js file for the query. 
--We cant set it to hardcoded values because the memberIDs change with new members joining

INSERT INTO Members (username, password, Fname, Lname, Email, Street, PCode, HomeNum, Gender, DOB, PhoneNumber, JoinDate) 
VALUES (username, password, fname, lname, email, street, pcode, homenum, gender, dob, phonenumber)

SELECT * FROM Members WHERE username = username AND password = password;

SELECT * FROM TrainingSessions WHERE trainerid = TrainerID ORDER BY SessionDate, SessionTime DESC;

SELECT * FROM TrainingSessions WHERE trainerid = TrainerID AND (SELECT current_date) + (SELECT current_time) >= sessiondate + sessiontime + duration;


SELECT * FROM Members WHERE memberid = MemberID;

SELECT * FROM TrainingSessions WHERE SessionDate >= CURRENT_DATE ORDER BY SessionDate, SessionTime;

SELECT * FROM TrainingSessions WHERE TrainerID = TrainerID AND SessionDate >= CURRENT_DATE;

SELECT * FROM Trainers WHERE username = username AND password = password;

SELECT * FROM AdminStaff WHERE username = username AND password;

SELECT * FROM FitnessEquipmentMaintenance

UPDATE FitnessEquipmentMaintenance SET MaintenanceID = MaintenanceID, MaintenanceDate = MaintenanceDate, MaintenanceDescription = MaintenanceDescription WHERE MaintenanceID = $1  

UPDATE TrainingSessions SET progressNotes = COALESCE(progressNotes, ProgressNotes) WHERE sessionID = SessionID AND trainerID = TrainerID AND (SELECT current_date) + (SELECT current_time) >= (sessionDate + sessionTime + duration) AND progressNotes IS NULL

SELECT * FROM Event WHERE trainerid = TrainerID ORDER BY EventDate, EventTime DESC

UPDATE TrainingSessions SET MemberID = MemberID WHERE SessionID = SessionID

UPDATE TrainingSessions SET MemberID = NULL WHERE SessionID = currentSessionID

UPDATE TrainingSessions SET MemberID = MemberID WHERE SessionID = newSessionID

UPDATE TrainingSessions SET MemberID = NULL WHERE SessionID =SessionID AND MemberID = MemberID

SELECT * FROM TrainingSessions WHERE TrainerID = TrainerID AND SessionDate >= CURRENT_DATE AND (SELECT current_date) + (SELECT current_time) < sessiondate + sessiontime + duration ORDER BY SessionDate, SessionTime


SELECT * FROM TrainingSessions WHERE trainerid = TrainerID AND (SELECT current_date) + (SELECT current_time) >= sessiondate + sessiontime + duration



--Events: 

INSERT INTO GroupFitness (StaffID, RoomNumber, TrainerID, EventDate, EventTime, EventDuration, EventType, FitnessTopic)
VALUES (1, 2, 4, '2023-11-27', '2023-11-27', '1:30', 'GroupFitness', 'topic1');

INSERT INTO GroupFitness (StaffID, RoomNumber, TrainerID, EventDate, EventTime, EventDuration, EventType, FitnessTopic)
VALUES (1, 1, 1, '2023-11-28', '2023-11-28', '01:30', 'GroupFitness', 'Topic1');



--Trainers: 

INSERT INTO Trainers (username, password, Fname, Lname, PhoneNumber)
VALUES ('Trainer1', '1234', 'Trainer1', 'ner1', '1234123412341234');
	

