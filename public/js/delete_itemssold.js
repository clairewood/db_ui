// This file was based on the delete_person.js file from the Node.js starter guide 
// accessed at this link: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

/*Step 7A */
function deleteItemsSold(item_id, sale_id){
    let link = '/delete-itemssold-ajax/';
    let data = {
        item_id: item_id,
        sale_id: sale_id
    };


    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:function(result) {
            deleteRow(item_id, sale_id);
        }
    });
}

function deleteRow(item_id, sale_id){
    let table = document.getElementById("itemssold-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if(table.rows[i].getAttribute("data-value") == item_id) {
            table.deleteRow(i); // TODO: What if the same item_id is in multiple places? 
            break;              // Have to add a check for sale_id here as well
        }
    }
}
