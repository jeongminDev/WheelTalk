import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { INotice } from './ArticleList';
import formatDate from './helpers/helpers';

interface ArticleProps {
  index: number;
  currentPage: number;
}

const Article = ({ id, createdAt, title, index, currentPage }: ArticleProps & INotice) => {
  return (
    <ArticleWrap>
      <Link to={`/notice/${id}`}>
        <ArticleList className="flex">
          <strong>{currentPage ? (currentPage - 1) * 15 + index + 1 : index}</strong>
          <p>{title}</p>
          <span>{formatDate(createdAt)}</span>
        </ArticleList>
      </Link>
    </ArticleWrap>
  );
};

export default Article;

const ArticleWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-evenly;
`;

const ArticleList = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
  padding: 0 20px;

  strong {
    min-width: 30px;
  }
  p {
    flex: 1;
  }

  span {
    color: #666;
    font-size: 14px;
  }
`;
