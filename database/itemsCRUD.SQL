
-- Create
CREATE OR REPLACE TABLE Items (
item_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
supplier_id int NOT NULL, 
material_id varchar(50),
color_id varchar(50),
in_stock boolean DEFAULT FALSE NOT NULL,
qty_on_hand int NULL,
price int NOT NULL,
FOREIGN KEY(supplier_id) REFERENCES Suppliers(supplier_id) ON DELETE CASCADE,
-- If Supplier is deleted, delete any associated items
FOREIGN KEY(material_id) REFERENCES Materials(material_id) ON DELETE RESTRICT,
FOREIGN KEY(color_id) REFERENCES Colors(color_id) ON DELETE RESTRICT;

-- anything with "value" in its name would be replaced

INSERT INTO Items (supplier_id, material_id, color_id, in_stock, qty_on_hand, price)
VALUES (supplier_id_value, material_id_value, color_id_value, in_stock_value, qty_on_hand_value, price_value);

-- Read 
SELECT * FROM Items;

SELECT * FROM Items WHERE item_id = item_id_value;

-- Update
UPDATE Items
SET supplier_id = supplier_id_value, material_id = material_id_value, color_id = color_id_value, in_stock = in_stock_value, qty_on_hand = qty_on_hand_value, price = price_value
WHERE item_id = item_id_value;

-- Delete
DELETE FROM Items WHERE item_id = item_id_value;