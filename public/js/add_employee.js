// This file was based on the add_person.js file from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax'); 

// Modify the objects we need
// (Gather input data from the form, package it into a single object called 'data')
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    //e.preventDefault(); 

    // Get form fields we need to get data from
    let inputFname = document.getElementById("input-employee_fname");
    let inputLname = document.getElementById("input-employee_lname");
    let inputPhone = document.getElementById("input-employee_phone");

    // Get the values from the form fields
    let FnameValue = inputFname.value;
    let LnameValue = inputLname.value;
    let phoneValue = inputPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        employee_fname: FnameValue,
        employee_lname: LnameValue,
        employee_phone: phoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // When we get OK code, we add the row the table in the DOM...
            addRowToTable(xhttp.response);

            // ...then clear the input fields for another transaction.
            inputFname.value = "";
            inputLname.value = "";
            inputPhone.value = "";
            inputEmail.value = "";
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
    let currentTable = document.getElementById("employees-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    
    let row = document.createElement("TR");
    let fnameCell = document.createElement("TD");
    let lnameCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");

    // Fill the cells with correct data
    fnameCell.innerText = newRow.employee_fname;
    lnameCell.innerText = newRow.employee_lname;
    phoneCell.innerText = newRow.employee_phone;
  
    // Add the cells to the row 
    row.appendChild(fnameCell);
    row.appendChild(lnameCell);
    row.appendChild(phoneCell);

    // Add the row to the table
    currentTable.appendChild(row);
    
}