-- clients.sql

-- SQL Schema for the clients table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'clients' AND type = 'U')
BEGIN
    CREATE TABLE clients (
        id INT IDENTITY(1,1) PRIMARY KEY, -- For auto-incrementing ID in SQL Server
        name VARCHAR(100) NOT NULL,
        industry VARCHAR(50),
        location VARCHAR(50),
        subscription_tier VARCHAR(20),
        signup_date DATE NOT NULL,
        is_active BIT DEFAULT 1,         -- BIT for boolean in SQL Server
        created_at DATETIME DEFAULT GETDATE(), -- DATETIME for timestamp
        updated_at DATETIME DEFAULT GETDATE()
    );
END;

-- Sample data insertion (for local database testing)
-- You can uncomment and run these if you are setting up a real database like PostgreSQL
-- INSERT INTO clients (name, industry, location, subscription_tier, signup_date, is_active) VALUES
-- ('Tech Solutions Inc.', 'IT', 'New York', 'Premium', '2023-01-15', TRUE),
-- ('Global Finance Group', 'Finance', 'London', 'Enterprise', '2022-03-20', TRUE),
-- ('MediHealth Systems', 'Healthcare', 'Los Angeles', 'Basic', '2024-02-10', FALSE),
-- ('EduTech Innovations', 'Education', 'Chicago', 'Free', '2023-07-01', TRUE),
-- ('Apex Manufacturing', 'Manufacturing', 'Houston', 'Premium', '2024-01-01', TRUE),
-- ('ByteWorks Technologies', 'IT', 'San Francisco', 'Enterprise', '2022-11-25', TRUE),
-- ('World Bank Corp', 'Finance', 'Tokyo', 'Premium', '2023-09-10', FALSE),
-- ('Wellness Connect', 'Healthcare', 'Sydney', 'Basic', '2024-03-05', TRUE),
-- ('Knowledge Hub', 'Education', 'Berlin', 'Free', '2023-04-18', TRUE),
-- ('Industrial Dynamics', 'Manufacturing', 'Paris', 'Premium', '2024-05-20', TRUE);
-- -- Add many more for comprehensive testing...

-- SQL Queries for Dashboard Metrics:

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

-- 3. Monthly Client Growth (New Signups)
SELECT
    DATE_TRUNC('month', signup_date) AS month,
    COUNT(id) AS new_clients_count
FROM
    clients
GROUP BY
    month
ORDER BY
    month ASC;

-- 4. Total Active Clients
SELECT
    COUNT(*) AS active_clients_count
FROM
    clients
WHERE
    is_active = TRUE;

-- 5. Total Clients (Overall)
SELECT
    COUNT(*) AS total_clients_count
FROM
    clients;

-- 6. Average Client Tenure (in months, simplified calculation from signup_date to current date)
-- Note: A more accurate tenure would involve churn dates or last active dates.
SELECT
    AVG(EXTRACT(EPOCH FROM (CURRENT_DATE - signup_date)) / (60 * 60 * 24 * 30.44)) AS avg_tenure_months
FROM
    clients;

-- 7. Clients filtered by Industry and Subscription Tier (Example of combining filters)
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
    industry = 'IT' AND subscription_tier = 'Premium';

-- 8. Count of active/inactive clients
SELECT
    is_active,
    COUNT(*) AS client_count
FROM
    clients
GROUP BY
    is_active;