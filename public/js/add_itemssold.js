// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get the objects we need to modify
let addItemsSoldForm = document.getElementById('add-itemssold-form-ajax'); 

// Modify the objects we need
// (Gather input data from the form, package it into a single object called 'data')
addItemsSoldForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    //e.preventDefault(); 

    // Get form fields we need to get data from
    let inputItem = document.getElementById("input-item_id");
    let inputSale = document.getElementById("input-sale_id");
    let inputQty = document.getElementById("input-qty_sold");

    // Get the values from the form fields
    let itemValue = inputItem.value;
    let saleValue = inputSale.value;
    let qtyValue = inputQty.value;

    // Put our data we want to send in a javascript object
    let data = {
        item_id: itemValue,
        sale_id: saleValue,
        qty_sold: qtyValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-itemssold-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // When we get OK code, we add the row the table in the DOM...
            addRowToTable(xhttp.response);

            // ...then clear the input fields for another transaction.
            inputItem.value = "";
            inputSale.value = "";
            inputQty.value = "";
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
    let currentTable = document.getElementById("itemssold-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    
    let row = document.createElement("TR");
    let itemCell = document.createElement("TD");
    let saleCell = document.createElement("TD");
    let qtyCell = document.createElement("TD");

    // Fill the cells with correct data
    itemCell.innerText = newRow.item_id;
    saleCell.innerText = newRow.sale_id;
    qtyCell.innerText = newRow.qty_sold;
  
    // Add the cells to the row 
    row.appendChild(itemCell);
    row.appendChild(saleCell);
    row.appendChild(qtyCell);

    // Add the row to the table
    currentTable.appendChild(row);
    
}