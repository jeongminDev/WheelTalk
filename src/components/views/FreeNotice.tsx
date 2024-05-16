import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
// import { useParams } from 'react-router-dom';

const FreeNotice = () => {
  // const param = useParams();
  // console.log(param);

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        <DetailNoticeList title={''} />
      </div>

      <Pagination />
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
  margin: 30px 0 50px;
`;
