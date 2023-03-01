// Get the objects we need to modify
let addItemForm = document.getElementById('add-item-form-ajax'); 
// CHANGED from add-item-form-ajax 

// Modify the objects we need
// (Gather input data from the form, package it into a single object called 'data')
addItemForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputSupplier = document.getElementById("input-supplier_id");
    let inputMaterial = document.getElementById("input-material_id");
    let inputColor = document.getElementById("input-color_id");
    let inputInStock = document.getElementById("input-in_stock");
    let inputQuantity = document.getElementById("input-qty_on_hand");
    let inputPrice = document.getElementById("input-price");

    // Get the values from the form fields
    let supplierValue = inputSupplier.value;
    let materialValue = inputMaterial.value;
    let colorValue = inputColor.value;
    let inStockValue = inputInStock.value;
    let quantityValue = inputQuantity.value;
    let priceValue = inputPrice.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        supplier_id: supplierValue,
        material_id: materialValue,
        color_id: colorValue,
        in_stock: inStockValue,
        qty_on_hand: quantityValue,
        price: priceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-item-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // When readyState becomes 4 it means it's done receiving
        // so we start looking for the "OK" code (200)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // When we get OK code, we add the row the table in the DOM...
            addRowToTable(xhttp.response);

            // ...then clear the input fields for another transaction.
            inputSupplier.value = "";
            inputMaterial.value = "";
            inputColor.value = "";
            inputInStock.value = "";
            inputQuantity.value = "";
            inputPrice.value = "";
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
    let currentTable = document.getElementById("items-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let supplierCell = document.createElement("TD");
    let materialCell = document.createElement("TD");
    let colorCell = document.createElement("TD");
    let instockCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let priceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.item_id;
    supplierCell.innerText = newRow.supplier_id;
    materialCell.innerText = newRow.material_id;
    colorCell.innerText = newRow.color_id;
    instockCell.innerText = newRow.in_stock;
    quantityCell.innerText = newRow.qty_on_hand;
    priceCell.innerText = newRow.price;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteItem(newRow.id);
    };
  

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(supplierCell);
    row.appendChild(materialCell);
    row.appendChild(colorCell);
    row.appendChild(instockCell);
    row.appendChild(quantityCell);
    row.appendChild(priceCell);
    row.appenndChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}