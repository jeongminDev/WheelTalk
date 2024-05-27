import { styled } from 'styled-components';
import Slider from '../components/Slider';
import SearchBar from '../components/SearchBar';
import PopularCharts from '../components/PopularCharts';
import ArticleList from '../components/ArticleList';
import { Category } from '../components/constants/category';

const Home = () => {
  return (
    <Wrapper className="main">
      <Slider />
      <SectionWrapper>
        <MainSection>
          <SectionLeft>
            <SearchBar position="" />
            <ArticleList cateTitle={'NEW'} noticeLimit={10} />
          </SectionLeft>
          <PopularCharts />
        </MainSection>
        <SubSection>
          {Object.entries(Category).map(([key, name]) => (
            <ArticleList key={key} cateTitle={name} noticeLimit={15} />
          ))}
        </SubSection>
      </SectionWrapper>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div``;

const SectionWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto 100px;
`;

const MainSection = styled.section`
  display: flex;
  justify-content: space-between;

  margin: 30px auto 50px;
`;

const SectionLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 800px;
`;

const SubSection = styled.div`
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
`;
