import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Error, Input, Switcher, Title, Wrapper, Form, Logo } from '../components/auth-components';
import GoogleButton from '../components/GoogleBtn';
import logoSrc from '../assets/images/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // useEffect를 사용하여 컴포넌트가 마운트될 때 현재 로그인한 사용자가 있는지 확인합니다.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // 사용자가 로그인한 상태면 홈 페이지로 리다이렉트합니다.
        navigate('/');
      }
    });

    // 구독을 취소하는 함수를 반환하여, 컴포넌트가 언마운트될 때 이벤트 리스너가 제거되도록 합니다.
    return () => unsubscribe();
  }, [navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      // create an account
      // set the name of the user.
      // redirect to the home page

      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }

    // console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Link
        style={{
          display: 'inline-block',
          width: '50%',
          marginBottom: 30,
        }}
        to={'/'}
      >
        <Logo src={logoSrc} />
      </Link>
      <Title>LOGIN</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? 'Loading...' : 'Login'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요? <Link to={'/join'}>Create One &rarr;</Link>
      </Switcher>
      {/* <GithubButton /> */}
      <GoogleButton />
    </Wrapper>
  );
};

export default Login;
