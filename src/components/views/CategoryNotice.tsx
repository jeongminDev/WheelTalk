import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { DocumentData, QueryDocumentSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const CategoryNotice = () => {
  const { cate } = useParams<{ cate: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageDocs, setPageDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchTotalItems = async () => {
      const snapshot = await getDocs(collection(db, 'notice'));
      setTotalItems(snapshot.size);
    };

    fetchTotalItems();
  }, []);

  // 기준점을 업데이트하는 함수
  const updatePageDocs = useCallback(
    (pageNumber: number, doc: QueryDocumentSnapshot<DocumentData>) => {
      setPageDocs((prevDocs) => {
        const newDocs = [...prevDocs];
        newDocs[pageNumber - 1] = doc;
        return newDocs;
      });
    },
    []
  );

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        {cate && (
          <DetailNoticeList
            title={cate}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            updatePageDocs={updatePageDocs}
            pageDocs={pageDocs}
          />
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
