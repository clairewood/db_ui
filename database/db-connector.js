// ./database/db-connector.js
// This code was based on the Node.js starter guide accessed at this link:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '', // username removed
    password        : '', // password removed
    database        : '' // database name removed
})

// Export it for use in our applicaiton
module.exports.pool = pool; 
