import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { INotice } from '../ArticleList';
import { Unsubscribe, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import formatDate from '../helpers/helpers';

const SearchPage = () => {
  const { value } = useParams();
  const [articles, setArticle] = useState<INotice[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchNotices = async () => {
      const articlesQuery = query(collection(db, 'notice'), orderBy('createdAt', 'desc'));

      unsubscribe = await onSnapshot(articlesQuery, (snapshot) => {
        const articles = snapshot.docs.map((doc) => {
          const { content, createdAt, userId, username, photos, category, brand, title } =
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

  const filteredArticles = articles.filter((article) => {
    if (!value) return;
    const searchMatch =
      value === '' ||
      article.title.toLowerCase().includes(value.toLowerCase()) ||
      article.content.toLowerCase().includes(value.toLowerCase());

    return searchMatch;
  });

  return (
    <Wrapper>
      <TitleSection>
        <h3>
          '{value}' 검색 결과 <span>{filteredArticles.length}개</span>
        </h3>
      </TitleSection>
      <ListSection>
        <ListWrapper>
          {filteredArticles.map((article, index) => (
            <List key={article.id}>
              <Link to={`/notice/${article.id}`}>
                <ArticleLayout>
                  <strong>{index + 1}</strong>
                  <p>{article.title}</p>
                  <span>{formatDate(article.createdAt)}</span>
                </ArticleLayout>
              </Link>
            </List>
          ))}
        </ListWrapper>
      </ListSection>
    </Wrapper>
  );
};

export default SearchPage;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 100px 0 50px;
`;

const TitleSection = styled.div`
  width: 100%;

  h3 {
    font-size: 24px;
  }
`;

const ListSection = styled.div``;

const ListWrapper = styled.div`
  border: solid 1px #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 15px 0;
  gap: 12px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-evenly;
`;

const ArticleLayout = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
  padding: 0 20px;

  strong {
    min-width: 30px;
  }
  p {
    flex: 1;
  }

  span {
    color: #666;
    font-size: 14px;
  }
`;
