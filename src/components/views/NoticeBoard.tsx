import styled from 'styled-components';
import DetailNoticeList from '../DetailNoticeList';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebase';

const NoticeBoard = () => {
  const { cate } = useParams<{ cate?: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageDocs, setPageDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const itemsPerPage = 17;

  useEffect(() => {
    const fetchTotalItems = async () => {
      let q;
      if (cate) {
        // 카테고리가 있을 경우 해당 카테고리의 게시글만 가져옵니다.
        q = query(collection(db, 'notice'), where('category', '==', cate));
      } else {
        // 카테고리가 없을 경우 모든 게시글을 가져옵니다.
        q = query(collection(db, 'notice'), where('category', '==', 'free'));
      }
      const snapshot = await getDocs(q);
      setTotalItems(snapshot.size);
    };

    fetchTotalItems();
  }, [cate]);

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
        <DetailNoticeList
          title={cate || ''}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          updatePageDocs={updatePageDocs}
          pageDocs={pageDocs}
        />
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

export default NoticeBoard;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 100px 0 50px;
`;
