import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
`;

const CardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Creates space between skeleton lines */
  align-items: center;
  justify-content: center;
  min-height: 150px; /* Ensures consistent size for skeletons */
  overflow: hidden;
  width: 100%; /* Ensure it fills its grid cell */
  box-sizing: border-box; /* Include padding in width */
`;

const SkeletonLine = styled.div`
  width: ${(props) => props.width || "80%"}; /* Allows width to be customized */
  height: ${(props) =>
    props.height || "1em"}; /* Allows height to be customized */
  background-color: #e0e0e0;
  border-radius: 4px;
  animation: ${pulse} 1.5s infinite ease-in-out; /* Apply pulse animation */
`;

const LoadingMetricCard = () => {
  return (
    <CardWrapper>
      <SkeletonLine width="60%" height="1.2em" />
      <SkeletonLine width="80%" height="0.8em" />
      <SkeletonLine width="50%" height="0.8em" />
    </CardWrapper>
  );
};

export default LoadingMetricCard;
