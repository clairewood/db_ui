// Get the objects we need to modify
let updateItemForm = document.getElementById('update-item-form-ajax');

// Modify the objects we need
updateItemForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputItemID = document.getElementById("mySelect");
    let inputSupplierID = document.getElementById("input-supplier_id-update");

    // Get the values from the form fields
    let itemIdValue = inputItemID.value;
    let supplierIdValue = inputSupplierID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(supplierIdValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        item_id: itemIdValue,
        supplier_id: supplierIdValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, itemIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, item_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("items-table"); 

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == item_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[1]; 
            // 1 instead of 3, I think (!!!)

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; // (!!!) why 0?
       }
    }
}