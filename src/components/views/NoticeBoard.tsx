import styled from 'styled-components';
import Pagination from '../layouts/Pagination';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  onSnapshot,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { INotice } from '../ArticleList';
import { Category } from '../constants/category';
import Article from '../Article';

const NoticeBoard = () => {
  const { cate } = useParams<{ cate?: string }>();
  const [notices, setNotices] = useState<INotice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageDocs, setPageDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const itemsPerPage = 15;
  const [, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTotalItems = async () => {
      let q;
      if (cate) {
        q = query(
          collection(db, 'notice'),
          where('brand', '==', Category[cate]),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'notice'),
          where('category', '==', 'free'),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      setTotalItems(snapshot.size);
    };

    fetchTotalItems();
  }, [cate]);

  useEffect(() => {
    const fetchNotices = async () => {
      let noticesQuery = query(
        collection(db, 'notice'),
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );

      if (cate) {
        noticesQuery = query(
          collection(db, 'notice'),
          where('brand', '==', Category[cate]),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );
      } else {
        noticesQuery = query(
          collection(db, 'notice'),
          where('category', '==', 'free'),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );
      }

      if (currentPage > 1 && pageDocs[currentPage - 2]) {
        noticesQuery = query(noticesQuery, startAfter(pageDocs[currentPage - 2]));
      }

      onSnapshot(noticesQuery, (snapshot) => {
        const newNotices = snapshot.docs.map((doc) => {
          const { content, createdAt, userId, username, photos, category, brand, title, likes } =
            doc.data();
          return {
            content,
            createdAt,
            userId,
            username,
            photos,
            id: doc.id,
            title,
            category,
            brand,
            likes,
          };
        });

        setNotices(newNotices);

        if (snapshot.docs.length > 0) {
          setPageDocs((prevDocs) => {
            const newDocs = [...prevDocs];
            newDocs[currentPage - 1] = snapshot.docs[snapshot.docs.length - 1];
            return newDocs;
          });
        }
        setHasMore(snapshot.docs.length === itemsPerPage);
      });
    };

    fetchNotices();
  }, [cate, currentPage, itemsPerPage, pageDocs]);

  useEffect(() => {
    // 카테고리가 변경될 때 페이지 초기화
    setCurrentPage(1);
  }, [cate]);

  const matchedCategory = cate && Category[cate] ? Category[cate] : '자유게시판';

  return (
    <Wrapper>
      <div className="overflow-x-auto">
        <TitleSection>
          <h2>{matchedCategory}</h2>
        </TitleSection>
        <ListWrapper className="article">
          {notices.map((notice, index) => (
            <Article key={notice.id} {...notice} currentPage={currentPage} index={index} />
          ))}
        </ListWrapper>
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
const ListWrapper = styled.div`
  border: solid 1px #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 20px;
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
