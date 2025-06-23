# GTS Client Statistics Dashboard Component

This project implements a dynamic Client Statistics Dashboard component for the GTS Service Platform. It showcases real-time statistics about employers/clients, including total clients, active clients, location/industry distribution, and monthly growth. It aims to boost credibility, aid benchmarking, and provide actionable insights.

## Features

- **Key Metrics Cards:** Displays Total Clients, Active Clients, and Average Client Tenure.
- **Interactive Charts:** Visualizes data using Bar, Pie, and Line charts (powered by Recharts) for location distribution, industry breakdown, and monthly client growth.
- **Enhanced Data Filtering:**
  - **Industry & Subscription Tier:** Dropdowns to filter clients.
  - **Client Search:** An input field to search clients by name.
  - **Date Range Filter:** Filter clients based on their signup date (e.g., "Last 3 Months", "This Year").
- **Improved User Experience:**
  - **Loading Skeletons:** Provides a smoother visual experience while data is being fetched.
  - **Error Boundary:** Gracefully handles unexpected JavaScript errors within the component tree, preventing a full application crash.
  - **Chart Toggling:** Allows users to hide or show individual charts based on their preference.
- **Responsive UI:** Designed with modern CSS (Flexbox & Grid via Styled Components) for optimal viewing on various devices.
- **API Integration:** Fetches data from a mock backend, demonstrating handling of loading and error states.
- **State Management:** Utilizes Redux Toolkit for efficient and scalable global state management.
- **Mock Backend:** Includes a `db.json` file and instructions to run a JSON Server to simulate the API.

## Technologies Used

- **Frontend:**
  - ReactJS
  - Redux Toolkit (for state management)
  - Recharts (for charting)
  - Axios (for API calls)
  - Styled Components (for CSS-in-JS styling)
- **Mock Backend:**
  - JSON Server
- **Database (Conceptual):**
  - PostgreSQL/MySQL (SQL queries provided in `clients.sql`)
- **Version Control:** Git

## Project Structure
