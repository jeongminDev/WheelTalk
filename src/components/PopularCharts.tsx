import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { INotice } from './ArticleList';
import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const PopularCharts = () => {
  // TODO search 검색어 순위 및 게시글 좋아요 기능 구현시 순위 (Tweet.tsx 참고)

  const [articles, setArticle] = useState<INotice[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchNotices = async () => {
      const articlesQuery = query(collection(db, 'notice'), orderBy('likes', 'desc'), limit(10));

      unsubscribe = await onSnapshot(articlesQuery, (snapshot) => {
        const articles = snapshot.docs.map((doc) => {
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
        setArticle(articles);
      });
    };
    fetchNotices();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      <ChartList>
        <Title>인기있는 게시글</Title>
        <Ranking>
          {articles.map((article, index: number) => {
            return (
              <Link to={`/notice/${article.id}`} key={index}>
                <em>{index + 1}</em>
                <p>{article.title}</p>
                <span>{article.likes}</span>
              </Link>
            );
          })}
        </Ranking>
      </ChartList>
    </Wrapper>
  );
};

export default PopularCharts;

const Wrapper = styled.div`
  width: 100%;
  max-width: 350px;
  border-radius: 5px;
  height: 400px;
  border: solid 1px #ddd;
  padding: 20px;
`;

const ChartList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 14px;
`;

const Ranking = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  a {
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    em {
      min-width: 40px;
      font-weight: 600;
      color: #666;
    }

    p {
      flex: 1;
      font-weight: 400;
    }

    span {
      min-width: 40px;
      text-align: right;
    }
  }
`;
