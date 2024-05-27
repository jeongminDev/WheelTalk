import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface SearchBarProps {
  position: string;
}

const SearchBar = ({ position }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!searchTerm) {
      return alert('검색어를 입력해주세요.');
    }

    e.preventDefault();
    navigate(`/search/${searchTerm}`);

    setSearchTerm('');
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit} className={position ? 'nav_search' : ''}>
        <Search type="text" value={searchTerm} placeholder={'Search'} onChange={handleSearch} />
        <SearchBtn type="submit">
          <svg
            fill="currentColor"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            />
          </svg>
        </SearchBtn>
      </form>
    </Wrapper>
  );
};

export default SearchBar;

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;

  form {
    display: flex;
    width: 100%;
    max-width: 800px;
    padding: 15px 20px;
    background-color: #ddd;
    border-radius: 5px;
  }

  .nav_search {
    background-color: inherit;
    border-radius: 50px;
    border: solid 2px #ddd;
    padding: 10px;
    padding-left: 30px;
  }
`;

const Search = styled.input`
  outline: none;
  background-color: inherit;
  flex: 1;
`;

const SearchBtn = styled.button`
  min-width: 25px;
`;
