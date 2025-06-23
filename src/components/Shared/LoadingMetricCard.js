// src/components/Shared/LoadingMetricCard.js
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
`;

const CardSkeleton = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  text-align: center;
  min-width: 280px;
  height: 120px; /* Consistent height with MetricCard */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const TextSkeleton = styled.div`
  height: ${(props) => props.height || "20px"};
  width: ${(props) => props.width || "80%"};
  background-color: #d0d0d0;
  border-radius: 4px;
  margin-bottom: ${(props) => props.marginBottom || "10px"};
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const LoadingMetricCard = () => {
  return (
    <CardSkeleton>
      <TextSkeleton width="60%" marginBottom="15px" />
      <TextSkeleton height="30px" width="40%" />
    </CardSkeleton>
  );
};

export default LoadingMetricCard;
