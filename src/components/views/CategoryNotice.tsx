import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const CategoryNotice = () => {
  const { cate } = useParams<{ cate: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchTotalItems = async () => {
      const snapshot = await getDocs(collection(db, 'notice'));
      setTotalItems(snapshot.size);
    };

    fetchTotalItems();
  }, []);

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        {cate && (
          <DetailNoticeList title={cate} itemsPerPage={itemsPerPage} currentPage={currentPage} />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
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
