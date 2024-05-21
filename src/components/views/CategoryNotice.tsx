import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';

const CategoryNotice = () => {
  const { cate } = useParams<{ cate: string }>();

  return (
    <Wrapper>
      <div className="overflow-x-auto">{cate && <DetailNoticeList title={cate} />}</div>
      <Pagination />
    </Wrapper>
  );
};

export default CategoryNotice;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 100px 0 50px;
`;
