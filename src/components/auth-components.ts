import { styled } from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0;
`;

export const Title = styled.h1`
  font-size: 42px;
  font-weight: bold;
`;

export const Logo = styled.img`
  display: block;
  width: 50%;
  margin: 0 auto;
  max-width: 105px;
`;

export const Form = styled.form`
  margin: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: solid 1px #ddd;
  width: 100%;
  font-size: 16px;

  &:focus {
    outline: none;
    border: solid 1px #666;
  }

  &[type='submit'] {
    cursor: pointer;
    &:hover {
      background-color: #666;
      color: #fff;
      border-color: #666;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: red;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #999;
    &:hover {
      color: #000;
    }
  }
`;

export const DeleteButton = styled.span`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    background: #666;
    color: #fff;
  }
`;
