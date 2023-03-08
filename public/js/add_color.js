// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get the objects we need to modify
let addColorForm = document.getElementById('add-color-form-ajax'); 

// Modify the objects we need
// (Gather input data from the form, package it into a single object called 'data')
addColorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    //e.preventDefault(); 

    // Get form fields we need to get data from
    let inputColor = document.getElementById("input-color_id");

    // Get the values from the form fields
    let colorValue = inputColor.value;

    // Put our data we want to send in a javascript object
    let data = {
        color_id: colorValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-color-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // When we get OK code, we add the row the table in the DOM...
            addRowToTable(xhttp.response);

            // ...then clear the input fields for another transaction.
            inputColor.value = "";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// DOM Manipulation
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("colors-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.color_id;
  
    // Add the cells to the row 
    row.appendChild(idCell);

    // Add the row to the table
    currentTable.appendChild(row);
    
}