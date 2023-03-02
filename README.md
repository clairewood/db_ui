# db_ui

Database UI for Intro the Databases class. <br>

This project was based on a walkthrough provided by our professor and the TAs for the Intro to Databases class, located here: https://github.com/osu-cs340-ecampus/nodejs-starter-app <br>

LINK to web page: http://flip3.engr.oregonstate.edu:9168/ <br>
(Unless forever stopped working in node)<br>

If getting errors when trying to use node in flip servers, run this: <br>
 --> nvm install 16.0.0 

To load the database with a file: <br>
 - add the source SQL file to database folder <br>
 - in MariaDB, run: source ./database/filename.sql;

TO DO: <br>
- add UPDATE to app.js <br>
- add DELETE to app.js<br>
- add all other tables (do not have to have CRUD capabilities)<br>
- Update app.js with the backend from the end of step 8

BEFORE SUBMITTING: <br>
- fix bug that adds comma to the end of text inputs -- HOW did this start <br>
- run forever again on the right port <br>
- populate materials and colors dynamically <br>
- drop diagnostic table from DB <br>
- fix css? <br>
- turn form inputs into dropdown menus <br>
- make sure every file has a source citation <br>
- figure out why auto incremented ID in Items is doing weird stuff <br>
- delete add_item.js from public folder if we end up sticking with form submittal method <br>
