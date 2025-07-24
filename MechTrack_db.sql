
-- crrete the database
CREATE DATABASE MechTrack;
GO

USE MechTrack;
GO


CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100),
    Address NVARCHAR(255),
    Phone NVARCHAR(50),
    Email NVARCHAR(100),
    Type NVARCHAR(50), 
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE CustomerContacts (
    ContactID INT PRIMARY KEY IDENTITY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    Name NVARCHAR(100),
    Role NVARCHAR(50),
    Phone NVARCHAR(50),
    Email NVARCHAR(100)
);

CREATE TABLE CustomerCars (
    CarID INT PRIMARY KEY IDENTITY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    LicensePlate NVARCHAR(20),
    PlateType NVARCHAR(30),
    Make NVARCHAR(50),
    Model NVARCHAR(50),
    Year INT,
    VIN NVARCHAR(50),
    Color NVARCHAR(30),
    EngineType NVARCHAR(50),
    TransmissionType NVARCHAR(50),
    Status NVARCHAR(50),
    WarrantyStartDate DATE,
    WarrantyEndDate DATE,
    WarrantyMaxMileage INT
);


CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(50),
    Type NVARCHAR(50), 
    Status NVARCHAR(50),
    HireDate DATE,
    Username NVARCHAR(50) UNIQUE,
    Password NVARCHAR(50),
    LastLogin DATETIME,
    LastPresentDate DATE 
);


CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    Type NVARCHAR(20), -- Stock / Service
    Unit NVARCHAR(20),
    Price DECIMAL(10,2),
    Status NVARCHAR(50)
);

CREATE TABLE InventoryGroups (
    GroupID INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(100),
    Description NVARCHAR(255)
);

CREATE TABLE InventoryGroupItems (
    InventoryID INT FOREIGN KEY REFERENCES Inventory(InventoryID),
    GroupID INT FOREIGN KEY REFERENCES InventoryGroups(GroupID),
    PRIMARY KEY (InventoryID, GroupID)
);


CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY IDENTITY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(50)
);


CREATE TABLE Tasks (
    TaskID INT PRIMARY KEY IDENTITY,
    ProjectID INT NULL FOREIGN KEY REFERENCES Projects(ProjectID),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    CarID INT FOREIGN KEY REFERENCES CustomerCars(CarID),
    Name NVARCHAR(100),
    Description NVARCHAR(255),
    Status NVARCHAR(50) DEFAULT 'Pending',
    StartTime DATETIME,
    EndTime DATETIME,
    ReceivedAt DATETIME,
    DeliveredAt DATETIME,
    DelayReason NVARCHAR(255)
);


CREATE TABLE TaskLines (
    TaskLineID INT PRIMARY KEY IDENTITY,
    TaskID INT FOREIGN KEY REFERENCES Tasks(TaskID),
    InventoryID INT FOREIGN KEY REFERENCES Inventory(InventoryID),
    EmployeeID INT FOREIGN KEY REFERENCES Employees(EmployeeID),
    Quantity DECIMAL(10,2),
    Description NVARCHAR(255),
    UnitPrice DECIMAL(10,2),
    LineTotal DECIMAL(10,2)
);


CREATE TABLE Invoices (
    InvoiceID INT PRIMARY KEY IDENTITY,
    DateIssued DATE,
    DueDate DATE,
    TotalAmount DECIMAL(10,2),
    Status NVARCHAR(50),
    Notes NVARCHAR(255),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID)
);

CREATE TABLE InvoiceLines (
    LineID INT PRIMARY KEY IDENTITY,
    InvoiceID INT FOREIGN KEY REFERENCES Invoices(InvoiceID),
    TaskLineID INT NULL FOREIGN KEY REFERENCES TaskLines(TaskLineID),
    InventoryID INT FOREIGN KEY REFERENCES Inventory(InventoryID),
    Description NVARCHAR(255),
    Quantity DECIMAL(10,2),
    UnitPrice DECIMAL(10,2),
    LineTotal DECIMAL(10,2)
);

/* 
   data for testing 
   */

-- Customers
INSERT INTO Customers (Name, Address, Phone, Email, Type, Status)
VALUES ('John Doe', '123 Main St', '555-1234', 'john@example.com', 'Individual', 'Active'),
       ('Acme Corp', '456 Industrial Rd', '555-5678', 'contact@acme.com', 'Company', 'Active'),
       ('Speedy Logistics', '789 Cargo Ave', '555-1111', 'ops@speedylog.com', 'Company', 'Active'),
       ('Mariam Ali', '12 Garden St', '555-2222', 'mariam.ali@mail.com', 'Individual', 'Active');

-- Customer contacts
INSERT INTO CustomerContacts (CustomerID, Name, Role, Phone, Email)
VALUES
(2, 'Ahmed Hassan', 'Fleet Manager', '555-8888', 'ahmed@acme.com'),
(3, 'Khaled Salem', 'Operations Supervisor', '555-7777', 'khaled@speedylog.com'),
(4, 'Mariam Ali', 'Owner', '555-2222', 'mariam.ali@mail.com');

-- Customer cars
INSERT INTO CustomerCars (CustomerID, LicensePlate, PlateType, Make, Model, Year, VIN, Color, EngineType, TransmissionType, Status,
                          WarrantyStartDate, WarrantyEndDate, WarrantyMaxMileage)
VALUES
(1, 'ABC123',  'Private',    'Toyota',  'Corolla', 2018, 'VIN123456',  'Blue',  'Gasoline', 'Automatic', 'Active', '2018-01-01', '2023-01-01', 100000),
(2, 'CMP-001', 'Commercial', 'Ford',    'Transit', 2017, 'VINTRN123',  'White', 'Diesel',   'Manual',    'Active', '2017-02-01', '2022-02-01', 200000),
(3, 'SPD-555', 'Commercial', 'Isuzu',   'NQR',     2019, 'VINSPEED55', 'White', 'Diesel',   'Manual',    'Active', '2019-03-10', '2024-03-10', 300000),
(4, 'MRY-007', 'Private',    'Hyundai', 'Elantra', 2021, 'VINMRY007',  'Red',   'Gasoline', 'Automatic', 'Active', '2021-04-15', '2026-04-15', 120000);

-- Employees
INSERT INTO Employees (Name, Email, Phone, Type, Status, HireDate, Username, Password)
VALUES ('Jane Smith', 'jane@workshop.com', '555-9999', 'Technician', 'Active', '2020-01-01', 'jane', '1234'),
       ('Omar Technician', 'omar@workshop.com', '555-3333', 'Technician', 'Active', '2019-03-15', 'omar', '123'),
       ('Sara Manager', 'sara@workshop.com', '555-4444', 'Manager', 'Active', '2018-06-10', 'sara', 'pass'),
       ('Hani Admin', 'hani@workshop.com', '555-5555', 'Admin', 'Active', '2017-08-20', 'hani', 'pass');

-- Inventory (items & services)
INSERT INTO Inventory (Name, Description, Type, Unit, Price, Status)
VALUES 
('Brake Pad', 'Front brake pad', 'Stock', 'pcs', 50.00, 'Available'),
('Oil Change', 'Engine oil service', 'Service', 'job', 100.00, 'Available'),
('Engine Oil 5W30', 'Synthetic engine oil', 'Stock', 'Litre', 15.00, 'Available'),
('Oil Filter', 'Standard oil filter', 'Stock', 'pcs', 8.00, 'Available'),
('Labour Hour - Tech', 'One hour of technician labour', 'Service', 'hour', 30.00, 'Available'),
('Brake Disc', 'Front brake disc', 'Stock', 'pcs', 120.00, 'Available'),
('Wheel Alignment', 'Wheel alignment service', 'Service', 'job', 60.00, 'Available');

-- Inventory groups
INSERT INTO InventoryGroups (Name, Description)
VALUES 
('Periodic Service', 'Regular periodic maintenance items'),
('Brake Service', 'All brake related items/services');

-- Inventory → Groups mapping
-- Periodic Service
INSERT INTO InventoryGroupItems (InventoryID, GroupID)
SELECT InventoryID, 1
FROM Inventory
WHERE Name IN ('Engine Oil 5W30', 'Oil Filter', 'Labour Hour - Tech');

-- Brake Service
INSERT INTO InventoryGroupItems (InventoryID, GroupID)
SELECT InventoryID, 2
FROM Inventory
WHERE Name IN ('Brake Pad', 'Brake Disc', 'Labour Hour - Tech');

-- Projects
INSERT INTO Projects (CustomerID, Name, Description, StartDate, EndDate, Status)
VALUES 
(2, 'Fleet Maintenance', 'Quarterly service for company fleet', NULL, NULL, 'Ongoing'),
(2, 'ACME Fleet Overhaul', 'Annual overhaul for vans', '2024-01-01', NULL, 'Ongoing'),
(3, 'Speedy Logistics Q2 Service', 'Quarterly service for trucks', '2024-04-01', NULL, 'Ongoing');

-- Tasks (one without project, others with)
INSERT INTO Tasks (ProjectID, CustomerID, CarID, Name, Description, Status, StartTime, ReceivedAt)
VALUES 
(NULL, 4, 4, 'Quick Oil Change', 'One-off oil change for Mariam', 'Pending', GETDATE(), GETDATE()),
(2, 3, 3, 'Truck Periodic Service', 'Q2 service inc. oil, filters', 'In Progress', GETDATE(), GETDATE()),
(1, 2, 2, 'Fleet Brake Check', 'Check and replace brakes if needed', 'Pending', GETDATE(), GETDATE());

-- TaskLines for task 2
INSERT INTO TaskLines (TaskID, InventoryID, EmployeeID, Quantity, Description, UnitPrice, LineTotal)
SELECT 2, i.InventoryID, 1, 5, 'Engine Oil 5W30 - 5 Litres', i.Price, i.Price * 5
FROM Inventory i WHERE i.Name = 'Engine Oil 5W30';

INSERT INTO TaskLines (TaskID, InventoryID, EmployeeID, Quantity, Description, UnitPrice, LineTotal)
SELECT 2, i.InventoryID, 1, 1, 'Oil Filter', i.Price, i.Price * 1
FROM Inventory i WHERE i.Name = 'Oil Filter';

INSERT INTO TaskLines (TaskID, InventoryID, EmployeeID, Quantity, Description, UnitPrice, LineTotal)
SELECT 2, i.InventoryID, 1, 2, 'Labour Hours', i.Price, i.Price * 2
FROM Inventory i WHERE i.Name = 'Labour Hour - Tech';

-- TaskLines for task 3
INSERT INTO TaskLines (TaskID, InventoryID, EmployeeID, Quantity, Description, UnitPrice, LineTotal)
SELECT 3, i.InventoryID, 1, 2, 'Brake Disc Replacement', i.Price, i.Price * 2
FROM Inventory i WHERE i.Name = 'Brake Disc';

-- Invoices
INSERT INTO Invoices (DateIssued, DueDate, TotalAmount, Status, Notes, CustomerID)
VALUES 
(GETDATE(), DATEADD(DAY, 30, GETDATE()), 100.00, 'Unpaid', 'Initial invoice', 1),
(GETDATE(), DATEADD(DAY, 30, GETDATE()), 250.00, 'Unpaid', 'Oil change and service', 4),
(GETDATE(), DATEADD(DAY, 30, GETDATE()), 500.00, 'Unpaid', 'Periodic service Q2', 3);

-- Invoice lines
-- Invoice 2 from Task 2 lines
INSERT INTO InvoiceLines (InvoiceID, TaskLineID, InventoryID, Description, Quantity, UnitPrice, LineTotal)
SELECT 2, tl.TaskLineID, tl.InventoryID, tl.Description, tl.Quantity, tl.UnitPrice, tl.LineTotal
FROM TaskLines tl WHERE tl.TaskID = 2;

-- Invoice 1 a manual line (no TaskLineID)
INSERT INTO InvoiceLines (InvoiceID, TaskLineID, InventoryID, Description, Quantity, UnitPrice, LineTotal)
VALUES (1, NULL, (SELECT TOP 1 InventoryID FROM Inventory WHERE Name = 'Wheel Alignment'),
        'Wheel alignment (manual add)', 1, 60.00, 60.00);
