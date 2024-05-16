import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ArticleProps {
  limit: number;
}

const Article = ({ limit }: ArticleProps) => {
  // username : user.displayName || 'Anonymous',
  // createdAt : Date.now(),
  // userId : user.uid
  // TODO firebase addDoc (Tweet.tsx 참고)
  const lists = Array.from({ length: limit }, (_, index) => ({
    name: `${index}`,
    createdAt: 1715748285564 + index,
    userId: `${index}`,
    title: '리스트 제목' + `${index}`,
  }));

  interface IListItem {
    readonly name: string;
    readonly createdAt: number;
    readonly userId: string;
    readonly title: string;
  }

  return (
    <ArticleWrap>
      {lists.map((list: IListItem, index: number) => {
        return (
          <Link to={'/list'} key={index}>
            <ArticleList className="flex">
              <strong>{index + 1}</strong>
              <p>{list.title}</p>
              <span>{list.createdAt}</span>
            </ArticleList>
          </Link>
        );
      })}
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
  align-items: stretch;
  gap: 30px;
  padding: 0 20px;

  strong {
    min-width: 30px;
  }
  p {
    flex: 1;
  }
`;
