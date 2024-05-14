import { styled } from 'styled-components';
import PostTweetForm from '../components/PostTweetForm';
import Timeline from '../components/Timeline';

const Home = () => {
  return <h1>Home!</h1>;
};

export default Home;

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
