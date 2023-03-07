// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get the objects we need to modify
let addSaleForm = document.getElementById('add-sale-form-ajax'); 

// Modify the objects we need
// (Gather input data from the form, package it into a single object called 'data')
addSaleForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    // e.preventDefault(); // CHANGED: Removed so page would refresh

    //<td>{{this.sale_id}}</td>
    //<td>{{this.sale_date}}</td>
    //<td>{{this.customer_id}}</td>
    //<td>{{this.employee_id}}</td>

    // Get form fields we need to get data from
    let inputDate = document.getElementById("input-sale_date");
    let inputCustomer = document.getElementById("input-customer_id");
    let inputEmployee = document.getElementById("input-employee_id");

    // Get the values from the form fields
    let dateValue = inputDate.value;
    let customerValue = inputCustomer.value;
    let employeeValue = inputEmployee.value;

    // Put our data we want to send in a javascript object
    let data = {
        sale_date: dateValue,
        customer_id: customerValue,
        employee_id: employeeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // When we get OK code, we add the row the table in the DOM...
            addRowToTable(xhttp.response);

            // ...then clear the input fields for another transaction.
            inputDate.value = "";
            inputCustomer.value = "";
            inputEmployee.value = "";
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
    let currentTable = document.getElementById("sales-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let customerCell = document.createElement("TD");
    let employeeCell = document.createElement("TD");

    let deleteCell = document.createElement("TD"); 

    // Fill the cells with correct data
    idCell.innerText = newRow.sale_id;
    dateCell.innerText = newRow.sale_date;
    customerCell.innerText = newRow.customer_id;
    employeeCell.innerText = newRow.employee_id;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteItem(newRow.id);
    };
  

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(customerCell);
    row.appendChild(employeeCell);


    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.sale_id); // changed to item_id

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.sale_id; // added option.text back in for html dropdown menu addition
    option.value = newRow.sale_id; // changed to item_id
    selectMenu.add(option);
    // End of new step 8 code.
}