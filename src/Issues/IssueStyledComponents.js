import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';

export const ChatBubbleBody = styled.div`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1.2em;
  padding-right: 1.2em;
  background-color: ${({ justify }) => (justify === 'flex-end' ? '#2e7d32' : '#f5f5f5')};
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 1px #2d2d2d;
  color: ${({ justify }) => (justify === 'flex-end' ? 'white' : 'black')};
  border-top-left-radius: ${({ justify }) => (justify === 'flex-end' ? '5px' : '0px')};
  border-top-left-radius: ${({ justify }) => (justify === 'flex-start' ? '5px' : '0px')};
`;

export const ChatBubbleText = styled(Typography)`
  &::first-letter {
    text-transform: capitalize;
  }
`;

export const ChatBubbleAvatar = styled(Avatar)`
  box-shadow: 0 0 6px 1px #2d2d2d;
  border: 0;
`;
