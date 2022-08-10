import styled from 'styled-components';

export const SharedTableContainer = styled.div`
  @media (max-width: 768px) {
    // min-width: 1005px;
    // height: 100vh;
    // padding: 0px 10px 0px 10px;
    left: 0px;
    position: absolute;
    overflow: scroll;
    max-width: 100vw;
    max-height: calc(100vh - 100px);
  }
`;
