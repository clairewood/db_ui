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

PORT = 9562; 

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { query } = require('express');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
var helpers = require('handlebars-helpers')(); // We'll use this to format the way date is displayed in Sales

// SETUP Section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public')) 
// app.use(express.static(__dirname + 'public')) 



/*
    ROUTES
*/

// GET ITEMS
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

        let query3 = "SELECT * FROM Materials;";

        let query4 = "SELECT * FROM Colors;";

    
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
                
                db.pool.query(query3, (error, rows, fields) => {

                    let materials = rows;

                    db.pool.query(query4, (error, rows, fields) => {

                        let colors = rows; 

                        return res.render('index', {data: items, suppliers: suppliers, materials: materials, colors: colors});
                        
                    })

                })

                // return res.render('index', {data: items, suppliers: suppliers});
            })
        })
});

// GET SALES

app.get('/sales', function(req, res)
    {
        let query1 = "SELECT * FROM Sales;";

        let query2 = "SELECT * FROM Employees;";

        let query3 = "SELECT * FROM Customers;";

        db.pool.query(query1, function(error, rows, fields){ 

            let sales = rows;

            db.pool.query(query3, (error, rows, fields) => {

                let customers = rows;

                let customermap = {}
                    customers.map(customer => {
                        let id = parseInt(customer.customer_id, 10);
    
                        customermap[id] = customer["customer_fname"]; 
                    })
    
                    sales = sales.map(sale => {
                        return Object.assign(sale, {customer_id: customermap[sale.customer_id]})
                    })

                db.pool.query(query2, (error, rows, fields) => {

                    let employees = rows;
    
                    let employeemap = {}
                    employees.map(employee => {
                        let id = parseInt(employee.employee_id, 10);
    
                        employeemap[id] = employee["employee_fname"]; 
                    })
    
                    sales = sales.map(sale => {
                        return Object.assign(sale, {employee_id: employeemap[sale.employee_id]})
                    })
                    
                    return res.render('sales', {data: sales, customers: customers, employees: employees})

                })
            })
        })
    });

// GET SUPPLIERS

app.get('/suppliers', function(req, res)
{  
    let query1 = "SELECT * FROM Suppliers;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('suppliers', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});   

// GET MATERIALS

app.get('/materials', function(req, res)
{  
    let query1 = "SELECT * FROM Materials;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('materials', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});   


// GET COLORS

app.get('/colors', function(req, res)
{  
    let query1 = "SELECT * FROM Colors;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('colors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});   


// GET ITEMSSOLD

app.get('/itemssold', function(req, res) {
    let query1 = "SELECT * FROM ItemsSold;";
    let query2 = "SELECT * FROM Items";
    let query3 = "SELECT * FROM Sales";
  
    db.pool.query(query1, function(error, rows, fields) {
      
        let itemssold = rows;
  
        db.pool.query(query3, (error, rows, fields) => {
        
        let sales = rows;
        
            db.pool.query(query2, (error, rows, fields) => {

            let items = rows;

            return res.render('itemssold', {data: itemssold, items: items, sales: sales});
            });
        });
    });
});


// ADD ITEMS

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

// DELETE ITEMS
    
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


// UPDATE ITEMS

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

// ADD SALES 

app.post('/add-sale-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let customer_id = parseInt(data.customer_id);
    if (isNaN(customer_id))
    {
        customer_id = 'NULL'
    }
    let employee_id = parseInt(data.employee_id);
    if (isNaN(employee_id))
    {
        employee_id = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Sales (sale_date, customer_id, employee_id) VALUES ('${data.sale_date}', ${customer_id}, ${employee_id})`;
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
            query2 = `SELECT Sales.sale_id, Sales.sale_date, Sales.customer_id, Sales.employee_id 
FROM Sales
LEFT JOIN Employees ON Sales.employee_id = Employees.employee_id;`;
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

// DELETE SALE
    
app.delete('/delete-sale-ajax/', function(req,res,next){
    let data = req.body;
    let sale_id = parseInt(data.id);
    let deleteItemsSold = `DELETE FROM ItemsSold WHERE sale_id = ?`;
    let deleteSales= `DELETE FROM Sales WHERE sale_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteItemsSold, [sale_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteSales, [sale_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })}); 


// UPDATE SALE

app.put('/put-sale-ajax', function(req,res,next){
    let data = req.body;

    let employee_id = parseInt(data.employee_id);
    if (isNaN(employee_id))
    {
        employee_id = null 
    }
    let sale_id = parseInt(data.sale_id);

    let queryUpdateEmployee = `UPDATE Sales SET employee_id = ? WHERE Sales.sale_id = ?`;
    let selectEmployee = `SELECT * FROM Employees WHERE employee_id = ?` // (!!!) check this shouldn't be supplier_name

        // Run the 1st query
        db.pool.query(queryUpdateEmployee, [employee_id, sale_id], function(error, rows, fields){
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
                db.pool.query(selectEmployee, [employee_id], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                }) 
            }
})});


// ADD SUPPLIERS

app.post('/add-supplier-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Suppliers (supplier_name) VALUES ('${data.supplier_name}')`;
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
            query2 = `SELECT * from Suppliers;`;
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


// ADD MATERIALS

app.post('/add-material-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Materials (material_id) VALUES ('${data.material_id}')`;
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
            query2 = `SELECT * from Materials;`;
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


// ADD COLORS

app.post('/add-color-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Colors (color_id) VALUES ('${data.color_id}')`;
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
            query2 = `SELECT * from Colors;`;
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

// ADD ITEMSSOLD

app.post('/add-itemssold-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let item_id = parseInt(data.item_id);
    if (isNaN(item_id))
    {
        item_id = null 
    }
    let sale_id = parseInt(data.sale_id);
    if (isNaN(sale_id))
    {
        sale_id = null 
    }
    let qty_sold = parseInt(data.qty_sold);
    if (isNaN(qty_sold))
    {
        qty_sold = null 
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO ItemsSold (item_id, sale_id, qty_sold) VALUES (${item_id}, ${sale_id}, ${qty_sold})`;
    db.pool.query(query1, function(error, rows, fields){ 

        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * from ItemsSold;`;
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

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
}); 
