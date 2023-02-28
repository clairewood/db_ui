-- Group 29
-- Project Step 2 Draft
-- Team Members: Marciles Matti and Claire Woodford

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create tables

CREATE OR REPLACE TABLE Suppliers(
supplier_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
supplier_name varchar(50)
);

CREATE OR REPLACE TABLE Materials(
material_id varchar(50) PRIMARY KEY 
);

CREATE OR REPLACE TABLE Colors(
color_id varchar(50) PRIMARY KEY 
);

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
FOREIGN KEY(color_id) REFERENCES Colors(color_id) ON DELETE RESTRICT 
-- Cannot delete Material or Color if their FK is present in Items table
);

CREATE OR REPLACE TABLE Customers (
customer_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
customer_fname varchar(50) NOT NULL,
customer_lname varchar(50) NOT NULL,
customer_phone char(10),
customer_email varchar(50)
);

CREATE OR REPLACE TABLE Employees (
employee_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
employee_fname varchar(50) NOT NULL,
employee_lname varchar(50) NOT NULL,
employee_phone char(10)
);

CREATE OR REPLACE TABLE Sales (
sale_id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
sale_date DATE,
customer_id int NOT NULL,
employee_id int NULL, 
FOREIGN KEY(customer_id) REFERENCES Customers(customer_id) ON DELETE RESTRICT,
-- Changed to prevents us from deleting a Customer from Customers table if they have an FK in Sales table
FOREIGN KEY(employee_id) REFERENCES Employees(employee_id) ON DELETE SET NULL
-- Changed so that if an Employee is deleted from Employee table, set any of their FKs in Sales to NULL
);

CREATE OR REPLACE TABLE ItemsSold(
item_id int,
sale_id int, 
qty_sold int NOT NULL,
FOREIGN KEY(item_id) REFERENCES Items(item_id) ON DELETE CASCADE, 
FOREIGN KEY(sale_id) REFERENCES Sales(sale_id) ON DELETE CASCADE,
-- M:M delete cascade: if Item or Sale is deleted, corresponding ItemsSold is deleted. 
PRIMARY KEY (item_id, sale_id)
);

-- Insert queries 

INSERT INTO Suppliers(supplier_name)  
VALUES ('FakeCompany'),
('Acme Anvils');

INSERT INTO Materials(material_id)
VALUES ('Yarn'),
('Glass');

INSERT INTO Colors(color_id)
VALUES ('Blue'),
('Red');

INSERT INTO Customers(customer_fname, customer_lname, customer_phone, customer_email)
VALUES ('Joel', 'Miller', 5555555555, 'joel.miller@hello.com'),
('Tommy', 'Miller', 4444444444, 'tom.miller@hello.com');

INSERT INTO Employees(employee_fname, employee_lname, employee_phone)
VALUES ('Ellie', 'Williams', 3333333333),
('Abby', 'Anderson', 1234567890);

INSERT INTO Items(in_stock, qty_on_hand, price, supplier_id, color_id, material_id)
VALUES (1, 10, 10.99, 1, 'Blue', 'Yarn'),
(0, 0,12.99, 1, 'Red', 'Glass');

INSERT INTO Sales(sale_date, customer_id, employee_id)
VALUES ('2023-02-07', 1, 1),
('2023-02-08', 2, NULL);

INSERT INTO ItemsSold(sale_id, item_id, qty_sold)
VALUES (1, 1, 5),
(2, 1, 1);



SET FOREIGN_KEY_CHECKS=1;
COMMIT;
