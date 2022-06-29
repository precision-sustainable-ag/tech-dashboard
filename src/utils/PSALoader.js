import React from 'react';
import styled, { keyframes } from 'styled-components';

const PSALoader = () => {
  return (
    <LoaderContainer>
      <Loader>
        <svg height="208" width="239.74">
          <polygon
            points="59.87 0,179.87 0,239.74 104,179.87 208,59.87 208,0 104,59.87 0"
            fill="#2F7C31"
          />
        </svg>
      </Loader>
      <LeavesContainer>
        <Stem bottom={true} />
        <div>
          <LeafLeft />
          <LeafRight />
        </div>
        <div>
          <LeafLeft />
          <LeafRight />
        </div>
        <div>
          <LeafLeft />
          <LeafRight />
        </div>
        <div>
          <LeafLeft />
          <LeafRight />
        </div>
        <LeafGroup>
          <ShortStem />
          <Stem bottom={false} />
          <ShortStem />
        </LeafGroup>
      </LeavesContainer>
    </LoaderContainer>
  );
};

export default PSALoader;

const LoaderContainer = styled.div`
  margin: 100px;
  height: fit-content;
  width: fit-content;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(-30deg);
`;

const rotate = keyframes`
  0% {
    transform: rotate(60deg);
  }
  50% {
    transform: rotate(-60deg);
  }
  100% {
    transform: rotate(60deg);
  }
`;

const Loader = styled.div`
  animation-name: ${rotate};
  animation-duration: 5s;
  animation-iteration-count: infinite;
  position: absolute;
  transform: rotate(30deg);
`;

// const HexTop = styled.div`
//   width: 0;
//   border-bottom: 60px solid #2f7c31;
//   border-left: 104px solid transparent;
//   border-right: 104px solid transparent;
// `;

// const HexMiddle = styled.div`
//   width: 208px;
//   height: 120px;
//   background-color: #2f7c31;
// `;

// const HexBottom = styled.div`
//   width: 0;
//   border-top: 60px solid #2f7c31;
//   border-left: 104px solid transparent;
//   border-right: 104px solid transparent;
// `;

const LeafLeft = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 100% 0;
  background-color: #fff;
`;

const LeafRight = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 100% 0;
  background-color: #fff;
  transform: rotate(90deg);
`;

const LeavesContainer = styled.div`
  width: 208px;
  height: 120px;
  z-index: 999;
  transform: rotate(-60deg);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeafGroup = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
`;

const Stem = styled.div`
  width: ${({ bottom }) => (bottom ? '20px' : '50px')};
  height: 4px;
  background-color: #fff;
`;

const ShortStem = styled.div`
  width: 30px;
  height: 4px;
  background-color: #fff;
  margin: 8px;
`;
