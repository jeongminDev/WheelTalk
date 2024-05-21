import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ArticleProps {
  limit: number;
  currentPage: number;
  itemsPerPage: number;
}

const Article = ({ limit, currentPage, itemsPerPage }: ArticleProps) => {
  // username : user.displayName || 'Anonymous',
  // createdAt : Date.now(),
  // userId : user.uid
  // TODO firebase addDoc (Tweet.tsx 참고)
  const lists = Array.from({ length: limit }, (_, index) => ({
    name: `${index}`,
    createdAt: 1715748285564 + index,
    userId: `${index}`,
    title: '리스트 제목 ' + `${index}`,
  }));

  // 현재 페이지에 해당하는 데이터만 필터링
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedLists = lists.slice(startIndex, startIndex + itemsPerPage);

  interface IListItem {
    readonly name: string;
    readonly createdAt: number;
    readonly userId: string;
    readonly title: string;
  }

  return (
    <ArticleWrap>
      {selectedLists.map((list: IListItem, index: number) => {
        return (
          <Link to={`/notice/${list.createdAt}/${list.title}`} key={index}>
            <ArticleList className="flex">
              <strong>{startIndex + index + 1}</strong>
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
  gap: 20px;
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
