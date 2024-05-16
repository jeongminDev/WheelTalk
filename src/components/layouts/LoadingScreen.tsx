import { styled } from 'styled-components';

const LoadingScreen = () => {
  return (
    <Wrapper>
      <Text>
        Loading<span className="loading loading-dots loading-md"></span>
      </Text>
    </Wrapper>
  );
};

export default LoadingScreen;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Text = styled.span`
  font-size: 24px;
  display: flex;
  gap: 10px;
`;
