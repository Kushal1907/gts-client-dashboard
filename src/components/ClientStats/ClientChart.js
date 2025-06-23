// src/components/ClientStats/ClientChart.js
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";

const ChartWrapper = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 350px; /* Fixed height for consistency across charts */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content vertically if chart is smaller */
  justify-content: center; /* Center content horizontally if chart is smaller */
`;

const ChartTitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2em;
`;

// A palette of colors for the charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const ClientChart = ({ title, data, type, dataKey, nameKey }) => {
  // Handle cases where data might be empty
  if (!data || data.length === 0) {
    return (
      <ChartWrapper>
        <ChartTitle>{title}</ChartTitle>
        <p>No data available for this chart.</p>
      </ChartWrapper>
    );
  }

  const renderChart = () => {
    switch (type) {
      case "Pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100} // Increased outerRadius for better visibility
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              } // Show percentage label
              labelLine={false} // Hide lines to labels
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} Clients`, name]} />{" "}
            {/* Custom tooltip */}
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
            />{" "}
            {/* Legend on the right */}
          </PieChart>
        );
      case "Bar":
        return (
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={nameKey}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={60}
            />{" "}
            {/* Rotate labels */}
            <YAxis allowDecimals={false} />{" "}
            {/* Ensure integer counts on Y-axis */}
            <Tooltip formatter={(value) => [`${value} Clients`]} />
            <Legend />
            <Bar dataKey={dataKey} fill="#82ca9d" />
          </BarChart>
        );
      case "Line":
        return (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} New Clients`]} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      default:
        return <p>Invalid chart type specified.</p>;
    }
  };

  return (
    <ChartWrapper>
      <ChartTitle>{title}</ChartTitle>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default ClientChart;
