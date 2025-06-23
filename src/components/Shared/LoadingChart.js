// src/components/Shared/LoadingChart.js
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
`;

const ChartSkeletonWrapper = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 350px; /* Consistent height with ClientChart */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const ChartTitleSkeleton = styled.div`
  height: 25px;
  width: 70%;
  background-color: #d0d0d0;
  border-radius: 4px;
  margin-bottom: 20px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const ChartAreaSkeleton = styled.div`
  flex-grow: 1;
  width: 100%;
  background-color: #d8d8d8;
  border-radius: 4px;
  margin-top: 10px;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const LoadingChart = () => {
  return (
    <ChartSkeletonWrapper>
      <ChartTitleSkeleton />
      <ChartAreaSkeleton />
    </ChartSkeletonWrapper>
  );
};

export default LoadingChart;
