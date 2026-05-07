import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-color);
  border-top: 3px solid #000;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
