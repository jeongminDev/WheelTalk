import { styled } from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';

interface DetailNoticeListProps {
  title: string;
}

const DetailNoticeList = (title: DetailNoticeListProps) => {
  // console.log(Category.benz.car.name);
  const keys = Object.keys(Category);
  const titleValue = Object.values(title).join('');

  const filteredKey = keys.filter((key: string) => key === titleValue).join('');

  return (
    <Wrapper>
      <TitleSection>
        <h2>{titleValue ? titleValue.toUpperCase() : '자유게시판'}</h2>
      </TitleSection>
      <ListWrapper className="article">
        <Article limit={10} />
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
