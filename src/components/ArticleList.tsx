import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';
import { useEffect, useState } from 'react';
import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

interface ArticleListProps {
  cateTitle: string;
  noticeLimit: number;
}

export interface INotice {
  id: string;
  photo: string;
  content: string;
  username: string;
  userId: string;
  createdAt: number;
  title: string;
  category: string;
  brand: string;
}

const ArticleList = ({ cateTitle, noticeLimit }: ArticleListProps) => {
  const [notices, setNotice] = useState<INotice[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const noticesQuery = query(
        collection(db, 'notice'),
        orderBy('createdAt', 'desc'),
        limit(noticeLimit)
      );

      unsubscribe = await onSnapshot(noticesQuery, (snapshot) => {
        const notices = snapshot.docs.map((doc) => {
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
        setNotice(notices);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [noticeLimit]);

  // Category 객체에서 title과 일치하는 값을 가진 키 찾기
  const cateEntry = Object.entries(Category).find(([key, name]) => name === cateTitle);

  const filteredNotice = notices.filter((notice) => notice.brand === cateTitle);

  // console.log(filteredNotice);

  // 찾은 키가 없을 경우 대비하여 기본값 설정
  const cateLink = cateEntry ? cateEntry[0] : '';

  return (
    <Wrapper>
      <TitleSection>
        <h2>{cateTitle}</h2>
        <Link to={`/category/${cateLink}`}>
          {cateTitle === 'NEW' ? null : <MoreBtn>더보기 &gt;</MoreBtn>}
        </Link>
      </TitleSection>
      <ListWrapper>
        {cateTitle === 'NEW'
          ? notices.map((notice, index) => (
              <Article key={notice.id} {...notice} index={index + 1} />
            ))
          : filteredNotice.map((notice, index) => (
              <Article key={notice.id} {...notice} index={index + 1} />
            ))}
      </ListWrapper>
    </Wrapper>
  );
};

export default ArticleList;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListWrapper = styled.div`
  min-height: 300px;
  border: solid 1px #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 20px;
  padding: 20px 0;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  h2 {
    font-weight: bold;
    margin: 23px 20px 10px;
  }
`;

const MoreBtn = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  margin-right: 10px;
`;
