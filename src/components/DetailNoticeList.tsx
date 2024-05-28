import { styled } from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';
import { useEffect, useState } from 'react';
import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { INotice } from './ArticleList';

interface DetailNoticeListProps {
  title: string;
  itemsPerPage: number;
  currentPage: number;
  updatePageDocs: (pageNumber: number, doc: QueryDocumentSnapshot<DocumentData>) => void; // 기준점 업데이트 함수
  pageDocs: QueryDocumentSnapshot<DocumentData>[]; // 각 페이지의 기준점 문서 배열
}

const DetailNoticeList = ({
  title,
  itemsPerPage,
  currentPage,
  updatePageDocs,
  pageDocs,
}: DetailNoticeListProps) => {
  const matchedCategory = Category[title];
  const [notices, setNotices] = useState<INotice[]>([]);
  const [hasMore, setHasMore] = useState(true); // 추가: 문서가 더 있는지 여부를 추적

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    // 추가: 문서가 더 이상 없거나, 첫 페이지를 로딩하는 경우가 아니면 작업을 실행하지 않음
    if (!hasMore && currentPage !== 1) return;

    const fetchNotices = async () => {
      let noticesQuery = query(
        collection(db, 'notice'),
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );

      if (currentPage > 1 && pageDocs[currentPage - 2]) {
        noticesQuery = query(
          collection(db, 'notice'),
          orderBy('createdAt', 'desc'),
          startAfter(pageDocs[currentPage - 2]),
          limit(itemsPerPage)
        );
      }

      unsubscribe = onSnapshot(noticesQuery, (snapshot) => {
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
          updatePageDocs(currentPage, snapshot.docs[snapshot.docs.length - 1]);
        }

        // 추가: 문서가 더 있는지 여부를 확인
        setHasMore(snapshot.docs.length === itemsPerPage);
      });
    };

    fetchNotices();

    return () => {
      unsubscribe && unsubscribe();
    };
    // 의존성 배열에서 pageDocs를 제거하고, hasMore 조건을 사용하여 재실행을 제어합니다.
  }, [itemsPerPage, currentPage, updatePageDocs, hasMore]);

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
