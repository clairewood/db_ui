// App.js
// This code was based on the Node.js starter guide accessed at this link:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app 

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT = 9168;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Static files
app.use(express.static('public')) 


/*
    ROUTES
*/

// GET
app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Items;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

// POST
app.post('/add-item-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let qty_on_hand = parseInt(data['input-qty_on_hand']);
    console.log(qty_on_hand)
    if (isNaN(qty_on_hand))
    {
        qty_on_hand = 'NULL'
    }
    let price = parseInt(data['input-price']);
    if (isNaN(price))
    {
        price = 'NULL'
    }
    let supplier_id = parseInt(data['input-supplier_id']);
    if (isNaN(supplier_id))
    {
        supplier_id = 'NULL'
    }
    let in_stock = parseInt(data['input-in_stock']);
    if (isNaN(in_stock))
    {
        in_stock = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Items (supplier_id, material_id, color_id, in_stock, qty_on_hand, price) VALUES (${supplier_id}, '${data['input-material_id']}', '${data['input-color_id']}', ${in_stock}, ${qty_on_hand}, ${price})`;
    db.pool.query(query1, function(error, rows, fields){ 

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/');
        }
    })
})
    
app.delete('/delete-item/:item_id', function(req,res,next){
    let data = req.body;
    console.log(req.params.item_id)
    let item_id = parseInt(data.id);
    let deleteItemsSold = `DELETE FROM ItemsSold WHERE pid = ?`;
    let deleteItems= `DELETE FROM Items WHERE id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteItemsSold, [req.params.item_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteItems, [req.params.item_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  app.put('/put-item-ajax', function(req,res,next){
    let data = req.body;
  
    let homeworld = parseInt(data.homeworld);
    let person = parseInt(data.fullname);
  
    let queryUpdateWorld = `UPDATE bsg_people SET homeworld = ? WHERE bsg_people.id = ?`;
    let selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateWorld, [homeworld, person], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectWorld, [homeworld], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
}); 