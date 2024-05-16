import styled from 'styled-components';

const SearchBar = () => {
  return (
    <Wrapper>
      <Search type="text" placeholder={'Search'} />
    </Wrapper>
  );
};

export default SearchBar;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 30px auto 0;
`;

const Search = styled.input`
  width: 100%;
  max-width: 800px;
  padding: 15px 20px;
  background-color: #ddd;
  border-radius: 5px;
  outline: none;
`;
