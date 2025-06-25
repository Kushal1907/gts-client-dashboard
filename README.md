GTS Client Statistics Dashboard

This project is a dynamic and interactive dashboard designed to display key statistics and manage client data for GTS. It provides a comprehensive overview of client activity, demographics, and growth trends through various metrics, charts, and a paginated client list, all with real-time updates.
✨ Features

    Dashboard Metrics: Displays key performance indicators such as Total Clients, Active Clients, Average Client Tenure, and Overall Growth.

    Interactive Charts: Visualizes client data through:

        Clients by Industry (Pie Chart): Shows the distribution of clients across different industries.

        Clients by Location (Bar Chart): Illustrates client distribution by geographical location.

        Monthly Client Growth (Line Chart): Tracks the growth of new clients over time.

    Client List: A detailed, paginated table displaying client information.

    Advanced Filtering: Filter clients by:

        Search Term (Client Name)

        Industry

        Subscription Tier

        Signup Date Range (predefined options like last 3/6 months, this/last year, or custom dates).

    Sorting: Sort the client list by various columns (Client Name, Industry, Location, Tier, Signup Date).

    Pagination: Navigate through large datasets with customizable rows per page.

    Real-time Updates: Utilizes WebSockets (Socket.IO) to receive instant notifications from the backend and automatically refresh dashboard data, ensuring you always see the most current information.

    Responsive Design: Optimized for various screen sizes, from mobile devices to large desktop monitors.

🚀 Technologies Used

    Frontend:

        React: A JavaScript library for building user interfaces.

        Redux Toolkit: The official, opinionated, batteries-included toolset for efficient Redux development.

        React Redux: Official React bindings for Redux.

        Styled Components: For writing CSS-in-JS, enabling component-level styling.

        Material-UI (MUI): A popular React UI framework for pre-built, accessible components.

        Recharts: A composable charting library built with React and D3.

        Axios: A promise-based HTTP client for making API requests.

        Axios-Retry: A plugin for Axios to automatically retry failed requests.

        Socket.IO Client: For real-time, bidirectional, event-based communication.

        date-fns: A modern JavaScript date utility library.

        @mui/x-date-pickers: Material-UI's date picker components.

    Backend (Simulated):

        JSON Server: A full fake REST API that allows quick prototyping and development without a real backend, simulating your db.json.

        Socket.IO: For real-time updates from the server (simulated).

🛠️ Installation

Follow these steps to get the project up and running on your local machine.
Prerequisites

    Node.js (LTS version recommended)

    npm or Yarn

1. Clone the Repository

git clone <repository_url>
cd gts-client-dashboard # Or whatever your project folder is named

2. Install Dependencies

Navigate into the project directory and install the required Node.js packages for both the client and the simulated server.

# Install client dependencies

npm install

# or yarn install

3. Setup the JSON Server (Backend Simulation)

This project uses json-server to simulate a backend API. You'll need a db.json file in your project root or a server folder.

Create a db.json file in your project's root (or a server/db.json if you prefer that structure) with sample data. Here's a minimal example:

{
"clients": [
{
"id": 1,
"name": "Acme Corp",
"industry": "Manufacturing",
"location": "New York",
"subscription_tier": "Enterprise",
"signup_date": "2023-01-15",
"is_active": true,
"monthly_spend": 1200
},
{
"id": 2,
"name": "Globex Inc.",
"industry": "IT",
"location": "San Francisco",
"subscription_tier": "Premium",
"signup_date": "2023-03-20",
"is_active": true,
"monthly_spend": 800
},
{
"id": 3,
"name": "Hooli LLC",
"industry": "IT",
"location": "Silicon Valley",
"subscription_tier": "Basic",
"signup_date": "2023-05-10",
"is_active": false,
"monthly_spend": 150
},
{
"id": 4,
"name": "Initech",
"industry": "Finance",
"location": "Austin",
"subscription_tier": "Premium",
"signup_date": "2023-07-01",
"is_active": true,
"monthly_spend": 600
},
{
"id": 5,
"name": "Cyberdyne Systems",
"industry": "Manufacturing",
"location": "Los Angeles",
"subscription_tier": "Enterprise",
"signup_date": "2023-09-22",
"is_active": true,
"monthly_spend": 1500
},
{
"id": 6,
"name": "Umbrella Corp",
"industry": "Healthcare",
"location": "Raccoon City",
"subscription_tier": "Basic",
"signup_date": "2023-11-05",
"is_active": true,
"monthly_spend": 200
},
{
"id": 7,
"name": "Tyrell Corp",
"industry": "IT",
"location": "Seattle",
"subscription_tier": "Premium",
"signup_date": "2024-01-01",
"is_active": false,
"monthly_spend": 900
},
{
"id": 8,
"name": "Weyland-Yutani",
"industry": "Manufacturing",
"location": "Houston",
"subscription_tier": "Enterprise",
"signup_date": "2024-02-28",
"is_active": true,
"monthly_spend": 1300
},
{
"id": 9,
"name": "Vault-Tec",
"industry": "Defense",
"location": "Washington D.C.",
"subscription_tier": "Basic",
"signup_date": "2024-04-10",
"is_active": true,
"monthly_spend": 250
},
{
"id": 10,
"name": "Massive Dynamic",
"industry": "Science",
"location": "Boston",
"subscription_tier": "Premium",
"signup_date": "2024-06-01",
"is_active": true,
"monthly_spend": 750
}
],
"active": {
"activeClients": 26,
"inactiveClients": 4
}
}

Install JSON Server and Socket.IO (if not already in package.json):
If your package.json doesn't have json-server and socket.io (for the backend simulation), install them as dev dependencies:

npm install -D json-server socket.io

# or yarn add -D json-server socket.io

Create a server.js file for the custom JSON Server with Socket.IO:

// server.js
const jsonServer = require('json-server');
const socketIO = require('socket.io');
const http = require('http');

const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Path to your db.json
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const httpServer = http.createServer(server);
const io = socketIO(httpServer, {
cors: {
origin: "http://localhost:3000", // Allow your React app to connect
methods: ["GET", "POST", "PUT", "DELETE"]
}
});

let interval;

// Watch for changes in db.json and emit 'dataUpdated'
router.render = (req, res) => {
res.jsonp(res.locals.data);
// Emit a 'dataUpdated' event whenever data changes
io.emit('dataUpdated');
console.log('Data updated in db.json, emitting dataUpdated event.');
};

// Simple mechanism to periodically update some data to simulate changes
// and trigger real-time updates. You can adjust or remove this.
const simulateBackendUpdates = () => {
if (interval) {
clearInterval(interval);
}
interval = setInterval(() => {
// Example: Increment a counter or change a client's status
const db = router.db.getState();
if (db.clients && db.clients.length > 0) {
const randomIndex = Math.floor(Math.random() _ db.clients.length);
db.clients[randomIndex].monthly_spend = Math.floor(Math.random() _ 1000) + 100; // Random monthly spend
router.db.write(); // Write changes to db.json
}
}, 30000); // Update every 30 seconds
};

httpServer.listen(3001, () => {
console.log('JSON Server with Socket.IO is running on port 3001');
// simulateBackendUpdates(); // Uncomment to enable simulated periodic updates
});

Add a script to your package.json to run the custom server:

{
"name": "gts-client-dashboard",
"version": "0.1.0",
"private": true,
"dependencies": {
// ... your existing dependencies
},
"scripts": {
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject",
"start:server:custom": "node server.js" // Add this line
},
"eslintConfig": {
"extends": [
"react-app",
"react-app/jest"
]
},
"browserslist": {
"production": [
">0.2%",
"not dead",
"not op_mini all"
],
"development": [
"last 1 chrome version",
"last 1 firefox version",
"last 1 safari version"
]
}
}

4. Run the Backend Server

Open a new terminal window (keep your first terminal for the React app) and run:

npm run start:server:custom

# or yarn start:server:custom

You should see output indicating the JSON Server with Socket.IO is running on port 3001. 5. Run the Frontend Application

In your original terminal window, start the React development server:

npm start

# or yarn start

This will open the application in your browser, usually at http://localhost:3000.
💡 Usage

Once the application is running:

    View Metrics: See the summarized client statistics at the top.

    Explore Charts: Interact with the Pie, Bar, and Line charts for visual insights. Use the "Hide/Show" buttons to toggle their visibility.

    Filter Data: Use the filter controls (Search, Industry, Subscription Tier, Date Range) to narrow down the client list and update dashboard metrics and charts.

    Sort Data: Click on table headers in the Client Details List to sort clients by different criteria.

    Paginate: Use the pagination controls at the bottom of the client list to navigate through pages and adjust the number of items displayed per page.

    Real-time Interaction: If you manually modify db.json (or if the simulated updates are enabled in server.js), you should see the dashboard update automatically after a short delay.

📁 Project Structure (Key Files)

gts-client-dashboard/
├── public/
├── src/
│ ├── app/
│ │ └── store.js # Redux store configuration
│ ├── components/
│ │ ├── ClientList/
│ │ │ └── ClientList.js # Table displaying client data
│ │ ├── ClientStats/
│ │ │ ├── ClientStats.js # Main dashboard component, orchestrates filters, charts, metrics, and list
│ │ │ ├── ClientChart.js # Reusable chart component
│ │ │ ├── FilterControls.js # Component for all filter inputs
│ │ │ └── MetricCard.js # Reusable metric display card
│ │ └── Shared/ # Common/reusable components (e.g., ErrorMessage, Loading components)
│ │ ├── ErrorMessage.js
│ │ ├── LoadingChart.js
│ │ └── LoadingMetricCard.js
│ ├── features/
│ │ └── clients/
│ │ └── clientSlice.js # Redux slice for client-related state, actions, and thunks
│ ├── index.js # Entry point, Redux Provider setup
│ └── App.js # Main App component
├── db.json # Simulated database for JSON Server
├── server.js # Custom JSON Server with Socket.IO for
