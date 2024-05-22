import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useState } from 'react';

const FreeNotice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // 예시로 설정

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        <DetailNoticeList title={''} />
      </div>

      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </Wrapper>
  );
};

export default FreeNotice;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 100px 0 50px;
`;
