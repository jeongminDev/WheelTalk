import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';

interface ArticleListProps {
  title: string;
  limit: number;
}

const ArticleList = ({ title, limit }: ArticleListProps) => {
  // Category 객체에서 title과 일치하는 값을 가진 키 찾기
  const cateEntry = Object.entries(Category).find(([key, name]) => name === title);

  // 찾은 키가 없을 경우 대비하여 기본값 설정
  const cateLink = cateEntry ? cateEntry[0] : '';

  return (
    <Wrapper>
      <TitleSection>
        <h2>{title}</h2>
        <Link to={`/category/${cateLink}`}>
          {title === 'NEW' ? null : <MoreBtn>더보기 &gt;</MoreBtn>}
        </Link>
      </TitleSection>
      <ListWrapper className="article">
        <Article limit={limit} />
      </ListWrapper>
    </Wrapper>
  );
};

export default ArticleList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListWrapper = styled.div`
  min-height: 300px;
  border: solid 1px #ddd;
  border-radius: 5px;
  display: flex;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  h2 {
    font-weight: bold;
    margin: 23px 20px 10px;
  }
`;

const MoreBtn = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  margin-right: 10px;
`;
