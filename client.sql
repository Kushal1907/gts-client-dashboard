-- clients.sql

-- SQL Schema for the clients table (for SQL Server)
-- This block checks if the 'clients' table exists before creating it.
-- This syntax is compatible with older SQL Server versions (pre-2016)
-- and remains robust for newer versions.
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'clients' AND type = 'U')
BEGIN
    CREATE TABLE clients (
        id INT IDENTITY(1,1) PRIMARY KEY, -- SQL Server's auto-incrementing primary key
        name VARCHAR(100) NOT NULL,
        industry VARCHAR(50),
        location VARCHAR(50),
        subscription_tier VARCHAR(20),
        signup_date DATE NOT NULL,
        is_active BIT DEFAULT 1,         -- SQL Server's boolean type (stores 0 or 1)
        created_at DATETIME DEFAULT GETDATE(), -- SQL Server's timestamp type with default current date/time
        updated_at DATETIME DEFAULT GETDATE()  -- Typically updated via application logic or a trigger for "ON UPDATE" functionality
    );
END;
GO -- Batch separator for SQL Server Management Studio (SSMS) or sqlcmd

-- Sample data insertion (for local database testing in SQL Server)
-- Uncomment and run these if you are setting up your SQL Server database
/*
INSERT INTO clients (name, industry, location, subscription_tier, signup_date, is_active) VALUES
('Tech Solutions Inc.', 'IT', 'New York', 'Premium', '2023-01-15', 1),
('Global Finance Group', 'Finance', 'London', 'Enterprise', '2022-03-20', 1),
('MediHealth Systems', 'Healthcare', 'Los Angeles', 'Basic', '2024-02-10', 0),
('EduTech Innovations', 'Education', 'Chicago', 'Free', '2023-07-01', 1),
('Apex Manufacturing', 'Manufacturing', 'Houston', 'Premium', '2024-01-01', 1),
('ByteWorks Technologies', 'IT', 'San Francisco', 'Enterprise', '2022-11-25', 1),
('World Bank Corp', 'Finance', 'Tokyo', 'Premium', '2023-09-10', 0),
('Wellness Connect', 'Healthcare', 'Sydney', 'Basic', '2024-03-05', 1),
('Knowledge Hub', 'Education', 'Berlin', 'Free', '2023-04-18', 1),
('Industrial Dynamics', 'Manufacturing', 'Paris', 'Premium', '2024-05-20', 1),
('Quantum AI', 'IT', 'Austin', 'Enterprise', '2024-03-22', 1),
('Eco Solutions', 'Manufacturing', 'Copenhagen', 'Basic', '2024-01-05', 1),
('Future Trends', 'Finance', 'Zurich', 'Premium', '2023-10-10', 1),
('NutriLife Clinic', 'Healthcare', 'Rio de Janeiro', 'Free', '2024-05-12', 1),
('Creative Minds', 'Education', 'Melbourne', 'Basic', '2023-06-25', 0),
('RoboFactory', 'Manufacturing', 'Seoul', 'Enterprise', '2024-04-15', 1),
('Agile Development', 'IT', 'Dublin', 'Premium', '2023-03-01', 1),
('InvestWise', 'Finance', 'Dubai', 'Basic', '2024-01-25', 1),
('Urban Health', 'Healthcare', 'Warsaw', 'Premium', '2022-08-08', 1),
('Coding Dojo', 'Education', 'Lisbon', 'Free', '2024-02-29', 1);
*/
GO

-- SQL Queries for Dashboard Metrics (for SQL Server):

-- 1. Total Clients per Industry
SELECT
    industry,
    COUNT(*) AS total_clients
FROM
    clients
GROUP BY
    industry
ORDER BY
    total_clients DESC;
GO

-- 2. Total Clients per Location
SELECT
    location,
    COUNT(*) AS total_clients
FROM
    clients
GROUP BY
    location
ORDER BY
    total_clients DESC;
GO

-- 3. Monthly Client Growth (New Signups)
-- Uses FORMAT() for SQL Server 2012+ or CONVERT() for older versions to get YYYY-MM
SELECT
    FORMAT(signup_date, 'yyyy-MM') AS month, -- For SQL Server 2012+
    -- ALTERNATIVE for older SQL Server: CONVERT(VARCHAR(7), signup_date, 120) AS month,
    COUNT(id) AS new_clients_count
FROM
    clients
GROUP BY
    FORMAT(signup_date, 'yyyy-MM') -- Group by the formatted month string
ORDER BY
    month ASC;
GO

-- 4. Total Active Clients
SELECT
    COUNT(*) AS active_clients_count
FROM
    clients
WHERE
    is_active = 1; -- Use 1 for TRUE in SQL Server BIT type
GO

-- 5. Total Clients (Overall)
SELECT
    COUNT(*) AS total_clients_count
FROM
    clients;
GO

-- 6. Average Client Tenure (in months, simplified calculation from signup_date to current date)
-- DATEDIFF(datepart, startdate, enddate) returns the count of the specified datepart boundaries
-- crossed between the specified startdate and enddate.
SELECT
    AVG(CAST(DATEDIFF(day, signup_date, GETDATE()) AS DECIMAL(10,2)) / 30.44) AS avg_tenure_months
FROM
    clients;
GO

-- 7. Clients filtered by Industry, Subscription Tier, Name Search, and Date Range
-- Example for a specific industry, premium tier, name search, and date range:
-- Uses LOWER() for case-insensitive search with LIKE operator (standard in SQL Server)
SELECT
    id,
    name,
    industry,
    location,
    subscription_tier,
    signup_date,
    is_active
FROM
    clients
WHERE
    industry = 'IT'
    AND subscription_tier = 'Premium'
    AND LOWER(name) LIKE LOWER('%Innovate%') -- Case-insensitive search for 'Innovate' in name
    AND signup_date BETWEEN '2023-01-01' AND '2023-12-31'; -- Clients signed up in 2023
GO

-- 8. Count of active/inactive clients
SELECT
    is_active,
    COUNT(*) AS client_count
FROM
    clients
GROUP BY
    is_active;
GO