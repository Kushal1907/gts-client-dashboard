import styled from "styled-components";

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px auto;
  background-color: #ffe0e0; /* Light red */
  border: 1px solid #ff0000; /* Red */
  border-radius: 8px;
  color: #ff0000;
  text-align: center;
  max-width: 600px;
`;

const ErrorTitle = styled.h2`
  color: #ff0000;
  margin-bottom: 10px;
`;

const ErrorMessage = ({ message }) => (
  <ErrorContainer role="alert">
    <ErrorTitle>Error!</ErrorTitle>
    <p>{message || "An unexpected error occurred. Please try again."}</p>
  </ErrorContainer>
);

export default ErrorMessage;
