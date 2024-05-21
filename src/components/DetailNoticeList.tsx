import { styled } from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';

interface DetailNoticeListProps {
  title: string;
  currentPage: number;
  itemsPerPage: number;
}

const DetailNoticeList = ({ title, currentPage, itemsPerPage }: DetailNoticeListProps) => {
  const matchedCategory = Category[title];

  return (
    <Wrapper>
      <TitleSection>
        <h2>{matchedCategory ? matchedCategory : '자유게시판'}</h2>
      </TitleSection>
      <ListWrapper className="article">
        <Article limit={100} currentPage={currentPage} itemsPerPage={itemsPerPage} />
      </ListWrapper>
    </Wrapper>
  );
};

export default DetailNoticeList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListWrapper = styled.div`
  min-height: 300px;
  border: solid 1px #ddd;
  border-radius: 5px;
  display: flex;
  padding: 20px 10px;
`;

const TitleSection = styled.div`
  text-align: left;
  padding-left: 20px;
  margin-bottom: 30px;
  h2 {
    font-weight: bold;
    font-size: 24px;
  }
`;
