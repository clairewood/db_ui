/*Step 7A */
function deleteItem(item_id){
    let link = '/delete-item-ajax/';
    let data = {
        id: item_id
    };


    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:function(result) {
            deleteRow(item_id);
        }
    });
}

function deleteRow(item_id){
    let table = document.getElementById("items-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if(table.rows[i].getAttribute("data-value") == item_id) {
            table.deleteRow(i);
            break;
        }
    }
}

/* Step 7B */
function deleteItem(item_id) {
    // Put our data we want to send in a javascript object
    let data = {
        id: item_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(item_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(item_id){

    let table = document.getElementById("item-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == item_id) {
            table.deleteRow(i);
            break;
       }
    }
}