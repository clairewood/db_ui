# db_ui

Database UI for Intro the Databases class. <br>

This project was based on a walkthrough provided by our professor and the TAs for our CS 340 Intro to Databases class. The walkthrough was accessed at this link:  https://github.com/osu-cs340-ecampus/nodejs-starter-app <br>

LINK to web page running on forever: http://flip1.engr.oregonstate.edu:9562/ <br>

LINK to web page currently being edited: http://flip2.engr.oregonstate.edu:9562/

To load the database with a file: <br>
 - add the source SQL file to database folder <br>
 - in MariaDB, run: source ./database/filename.sql;

TO DO: <br>
- Add Employees table <br>
- Finish ItemsSold table -- needs Delete button <br>
- Fix employee_id and customer_id to show up as fname AND lname in Sales <br>
- Fix dynamic population issues: <br>
---- ITEMS -> materials, colors, in_stock (populate YES or NO instead of 1 or 0) <br>
---- SALES -> employee_id (add lname), customer_id <br>

Lower priority: <br>
- Add auto-refresh to DELETE <br>
- Change table header names to real names (qty_on_hand to Quantity) <br>

NOTES FOR SUBMITTAL: <br>
- What works: Create and Read for Colors, Materials, and Suppliers, <br> 
and CRUD for Items and Sales <br>
- What doesn't: 

