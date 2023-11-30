--Training Sessions:

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-11-28', '05:15', '01:30'); 

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-11-28', '11:30', '01:30');

INSERT INTO TrainingSessions (MemberID, TrainerID, SessionDate, SessionTime, Duration)
VALUES (2, 4, '2023-12-30', '11:30', '01:30');



--Events: 

INSERT INTO GroupFitness (StaffID, RoomNumber, TrainerID, EventDate, EventTime, EventDuration, EventType, FitnessTopic)
VALUES (1, 2, 4, '2023-11-27', '2023-11-27', '1:30', 'GroupFitness', 'topic1');

INSERT INTO GroupFitness (StaffID, RoomNumber, TrainerID, EventDate, EventTime, EventDuration, EventType, FitnessTopic)
VALUES (1, 1, 1, '2023-11-28', '2023-11-28', '01:30', 'GroupFitness', 'Topic1');



--Trainers: 

INSERT INTO Trainers (username, password, Fname, Lname, PhoneNumber)
VALUES ('Trainer1', '1234', 'Trainer1', 'ner1', '1234123412341234');
	

