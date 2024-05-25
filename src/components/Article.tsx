import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { INotice } from './ArticleList';
import formatDate from './helpers/helpers';

interface ArticleProps {
  index: number;
}

const Article = ({
  id,
  photos,
  content,
  username,
  userId,
  createdAt,
  title,
  category,
  brand,
  index,
}: ArticleProps & INotice) => {
  return (
    <ArticleWrap>
      <Link to={`/notice/${id}`}>
        <ArticleList className="flex">
          <strong>{index}</strong>
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
