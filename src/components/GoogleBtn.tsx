import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const GoogleButton = () => {
  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/google-logo.svg" />
      Continue with Google
    </Button>
  );
};

export default GoogleButton;

const Button = styled.span`
  margin-top: 20px;
  background-color: white;
  font-weight: 600;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: solid 1px #ddd;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    border: solid 1px #666;
  }
`;

const Logo = styled.img`
  height: 25px;
`;
