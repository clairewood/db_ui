// App.js
// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
//app.use(express.json())
//app.use(express.urlencoded({extended: true}))

PORT = 9157; 

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { query } = require('express');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// SETUP Section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public')) 
// app.use(express.static(__dirname + 'public')) 



/*
    ROUTES
*/

// GET
app.get('/', function(req, res)
    {  
        // Declare Query 1
        let query1;

        // If there is no query string, we just perform a basic SELECT
        if (req.query.material_id === undefined)
        {
            query1 = "SELECT * FROM Items;";
        }
        else 
        {
            query1 = `SELECT * FROM Items where material_id like "${req.query.material_id}%"`
        }
    
        // Query 2 is the same in both cases
        let query2 = "SELECT * FROM Suppliers;";
    
        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
            
            // Save the people (people = items)
            let items = rows;
            
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
                
                // Save the planets (planets = suppliers)
                let suppliers = rows;

                // Construct an object for reference in the table
                // Array.map is awesome for doing something with each
                // element of an array.
                let suppliermap = {}
                suppliers.map(supplier => {
                    let id = parseInt(supplier.supplier_id, 10); 

                    suppliermap[id] = supplier["supplier_name"];
                })

                // Overwrite the homeworld ID with the name of the planet in the people object
                items = items.map(item => {
                    return Object.assign(item, {supplier_id: suppliermap[item.supplier_id]})
                })

                return res.render('index', {data: items, suppliers: suppliers});
            })
        })
});

// POST -- ajax method instead
app.post('/add-item-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let qty_on_hand = parseInt(data.qty_on_hand);
    if (isNaN(qty_on_hand))
    {
        qty_on_hand = 'NULL'
    }
    let price = parseInt(data.price);
    if (isNaN(price))
    {
        price = 'NULL'
    }
    let supplier_id = parseInt(data.supplier_id);
    if (isNaN(supplier_id))
    {
        supplier_id = 'NULL'
    }
    let in_stock = parseInt(data.in_stock);
    if (isNaN(in_stock))
    {
        in_stock = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Items (supplier_id, material_id, color_id, in_stock, qty_on_hand, price) VALUES (${supplier_id}, '${data.material_id}', '${data.color_id}', ${in_stock}, ${qty_on_hand}, ${price})`;
    db.pool.query(query1, function(error, rows, fields){ 

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT Items.item_id, Items.supplier_id, Items.material_id, Items.color_id, Items.in_stock, Items.qty_on_hand, Items.price 
FROM Items
LEFT JOIN Suppliers ON Items.supplier_id = Suppliers.supplier_id;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

    
app.delete('/delete-item-ajax/', function(req,res,next){
    let data = req.body;
    let item_id = parseInt(data.id);
    let deleteItemsSold = `DELETE FROM ItemsSold WHERE item_id = ?`;
    let deleteItems= `DELETE FROM Items WHERE item_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteItemsSold, [item_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteItems, [item_id], function(error, rows, fields) {
  
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

    let supplier_id = parseInt(data.supplier_id);
    let item_id = parseInt(data.item_id);

    let queryUpdateSupplier = `UPDATE Items SET supplier_id = ? WHERE Items.item_id = ?`;
    let selectSupplier = `SELECT * FROM Suppliers WHERE supplier_id = ?` // (!!!) check this shouldn't be supplier_name

        // Run the 1st query
        db.pool.query(queryUpdateSupplier, [supplier_id, item_id], function(error, rows, fields){
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
                db.pool.query(selectSupplier, [supplier_id], function(error, rows, fields) {

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