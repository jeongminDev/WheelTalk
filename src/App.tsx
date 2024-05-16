import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Nav from './components/layouts/Nav';
import Home from './routes/Home';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import List from './components/List';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/layouts/LoadingScreen';
import { auth } from './firebase';
import Footer from './components/layouts/Footer';
import FreeNotice from './components/views/FreeNotice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Nav />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'list',
        element: <List />,
      },
      {
        path: '/:free',
        element: <FreeNotice />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/join',
    element: <CreateAccount />,
  },
]);

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    // wait for firebase
    await auth.authStateReady();

    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);

    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      <Footer githubUrl="https://github.com/jeongminDev/WheelTalk" />
    </Wrapper>
  );
}

export default App;

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body{
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  a{
    text-decoration: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 90px);
  position: relative;
`;
