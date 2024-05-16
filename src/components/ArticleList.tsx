import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Article from './Article';

interface ArticleListProps {
  title: string;
  limit: number;
}

const ArticleList = ({ title, limit }: ArticleListProps) => {
  // const param = useParams();
  // const paramKey = Object.keys(param).join('');

  return (
    <Wrapper>
      <TitleSection>
        <h2>{title}</h2>
        {/* {paramKey ? null : (
          <Link to={'/list'}>
            <MoreBtn>더보기 &gt;</MoreBtn>
          </Link>
        )} */}
        <Link to={'/list'}>
          <MoreBtn>더보기 &gt;</MoreBtn>
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
