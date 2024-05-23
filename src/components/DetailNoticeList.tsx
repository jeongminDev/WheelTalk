import { styled } from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';
import { useEffect, useRef, useState } from 'react';
import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { INotice } from './ArticleList';

interface DetailNoticeListProps {
  title: string;
  itemsPerPage: number;
  currentPage: number; // 현재 페이지
}

const DetailNoticeList = ({ title, itemsPerPage, currentPage }: DetailNoticeListProps) => {
  const matchedCategory = Category[title];
  const [notices, setNotice] = useState<INotice[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const lastVisibleRef = useRef<any>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchNotices = async () => {
      let noticesQuery = query(
        collection(db, 'notice'),
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );

      if (currentPage > 1 && lastVisibleRef.current) {
        noticesQuery = query(
          collection(db, 'notice'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisibleRef.current),
          limit(itemsPerPage)
        );
      }

      unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
        const newNotices = snapshot.docs.map((doc) => {
          const { content, createdAt, userId, username, photo, category, brand, title } =
            doc.data();
          return {
            content,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            title,
            category,
            brand,
          };
        });

        setNotice(newNotices);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1];
      });
    };

    fetchNotices();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [itemsPerPage, currentPage]);

  const filteredCateNotice = notices.filter((notice) => notice.brand === matchedCategory);
  const filteredFreeNotice = notices.filter((notice) => notice.category === 'free');

  return (
    <Wrapper>
      <TitleSection>
        <h2>{matchedCategory ? matchedCategory : '자유게시판'}</h2>
      </TitleSection>
      <ListWrapper className="article">
        {matchedCategory
          ? filteredCateNotice.map((notice, index) => (
              <Article key={notice.id} {...notice} index={index + 1} />
            ))
          : filteredFreeNotice.map((notice, index) => (
              <Article key={notice.id} {...notice} index={index + 1} />
            ))}
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
