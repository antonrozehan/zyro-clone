import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonWrapper = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

const SkeletonImage = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonContent = styled.div`
  padding: 1rem;
`;

const SkeletonTitle = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  width: 80%;
`;

const SkeletonPrice = styled.div`
  height: 24px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  width: 40%;
  margin-bottom: 0.5rem;
`;

const SkeletonRating = styled.div`
  height: 14px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  width: 60%;
`;

const SkeletonCard: React.FC = () => {
  return (
    <SkeletonWrapper>
      <SkeletonImage />
      <SkeletonContent>
        <SkeletonTitle />
        <SkeletonPrice />
        <SkeletonRating />
      </SkeletonContent>
    </SkeletonWrapper>
  );
};

export default React.memo(SkeletonCard);
