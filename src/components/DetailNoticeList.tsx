import { styled } from 'styled-components';
import Article from './Article';
import { Category } from './constants/category';
import { useEffect, useState } from 'react';
import { Unsubscribe, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { INotice } from './ArticleList';

interface DetailNoticeListProps {
  title: string;
}

const DetailNoticeList = ({ title }: DetailNoticeListProps) => {
  const matchedCategory = Category[title];

  const [notices, setNotice] = useState<INotice[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const noticesQuery = query(collection(db, 'notice'), orderBy('createdAt', 'desc'));

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
  }, []);

  return (
    <Wrapper>
      <TitleSection>
        <h2>{matchedCategory ? matchedCategory : '자유게시판'}</h2>
      </TitleSection>
      <ListWrapper className="article">
        {notices.map((notice, index) => (
          <Article key={notice.id} {...notice} index={index + 1} currentPage={0} itemsPerPage={0} />
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
  min-height: 300px;
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
