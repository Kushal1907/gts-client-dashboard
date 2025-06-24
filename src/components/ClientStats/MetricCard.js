// src/components/ClientStats/MetricCard.js
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  animation: ${fadeIn} 0.5s ease-out forwards; /* Apply animation */
  min-width: 250px; /* Ensure minimum width */

  /* NEW: Hover Effect */
  &:hover {
    transform: translateY(-5px); /* Lifts the card up slightly */
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15); /* Larger, more pronounced shadow */
    cursor: pointer; /* Indicates it's interactive, even if not clickable */
  }
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1em;
  font-weight: 500;
`;

const Value = styled.p`
  color: #007bff; /* GTS primary color - example blue */
  font-size: 2.2em;
  font-weight: bold;
  margin: 0;
`;

const MetricCard = ({ title, value }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  );
};

export default MetricCard;
