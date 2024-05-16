import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Error, Input, Switcher, Title, Wrapper, Form, Logo } from '../components/auth-components';
import GoogleButton from '../components/GoogleBtn';
import logoSrc from '../assets/images/logo_B.png';

const CreateAccount = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [carNumber, setCarNumber] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;

    if (password !== confirmPassword) {
      setError('패스워드가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(credentials.user, {
        displayName: name,
      });
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
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
      <Title>JOIN</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="이름을 입력해주세요."
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email을 입력해주세요. ex) abc@def.com"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호를 입력해주세요."
          type="password"
          required
        />
        <Input
          onChange={onChange}
          name="confirmPassword"
          value={confirmPassword}
          placeholder="동일한 비밀번호를 입력해주세요."
          type="password"
          required
        />
        {/* <Input
          onChange={onChange}
          name="carNumber"
          value={carNumber}
          placeholder="차량 번호를 입력해주세요.ex) 12가 1234"
          type="text"
        /> */}
        <Input type="submit" value={isLoading ? 'Loading...' : 'Create Account'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있으신가요? <Link to={'/login'}>Log in &rarr;</Link>
      </Switcher>
      <GoogleButton />
    </Wrapper>
  );
};

export default CreateAccount;
