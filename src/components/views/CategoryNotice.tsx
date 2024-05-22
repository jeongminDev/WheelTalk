import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const CategoryNotice = () => {
  const { cate } = useParams<{ cate: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 예시로 설정

  return (
    <Wrapper>
      <div className="overflow-x-auto">{cate && <DetailNoticeList title={cate} />}</div>
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
