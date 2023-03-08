// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Get the objects we need to modify
let updateSaleForm = document.getElementById('update-sale-form-ajax');

// Modify the objects we need
updateSaleForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault(); // CHANGED: Removed this so page would refresh

    // Get form fields we need to get data from
    let inputSaleID = document.getElementById("mySelect");
    let inputEmployeeID = document.getElementById("input-employee_id-update");

    // Get the values from the form fields
    let saleIdValue = inputSaleID.value;
    let employeeIdValue = inputEmployeeID.value;
    
    // catch NaN

    if (isNaN(employeeIdValue)) 
    {
        employeeIdValue = 'NULL'
    }

    // catch NaN

    // Put our data we want to send in a javascript object
    let data = {
        sale_id: saleIdValue,
        employee_id: employeeIdValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, saleIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, sale_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("sales-table"); 

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == sale_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3]; 
            //BROKE EVERYTHING when I changed this from 1 to 3

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; // (!!!) why 0?
       }
    }
}