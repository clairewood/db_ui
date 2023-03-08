// This file was based on the file of the same name/location from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

/*Step 7A */
function deleteSale(sale_id){
    let link = '/delete-sale-ajax/';
    let data = {
        id: sale_id
    };


    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:function(result) {
            deleteRow(sale_id);
        }
    });
}

function deleteRow(sale_id){
    let table = document.getElementById("sales-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if(table.rows[i].getAttribute("data-value") == sale_id) {
            table.deleteRow(i);
            break;
        }
    }
}

/* Step 7B */
function deleteSale(sale_id) {
    // Put our data we want to send in a javascript object
    let data = {
        id: sale_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-sale-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(sale_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(sale_id){

    let table = document.getElementById("sales-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == sale_id) {
            table.deleteRow(i);
            break;
       }
    }
}