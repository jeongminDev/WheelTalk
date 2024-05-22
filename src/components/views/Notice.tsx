import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';
import formatDate from '../helpers/helpers';

// 게시글 데이터 타입 정의
interface Article {
  id: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  imageUrl?: string;
}

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

const Notice = () => {
  const { createdAt, title } = useParams<{ createdAt: string; title: string }>();
  const [article, setArticle] = useState<Article | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);

  // 가상의 API 호출 함수 (실제 구현 필요)
  const fetchArticleById = async (date: string, title: string): Promise<Article> => {
    // 타입 추가
    // 여기에 실제 데이터를 가져오는 코드를 구현해야 합니다.
    // 이 예시에서는 단순히 가짜 데이터를 반환합니다.

    return {
      id: '임의의-아이디', // id 값을 임의의 값으로 설정 추후 userId
      title: title,

      content:
        ' 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용 가상의 게시글 내용',
      // content 값을 임의의 값으로 설정 추후 content
      username: '작성자', // username 값을 임의의 값으로 설정 추후 username
      createdAt: formatDate(+date),
      // createdAt: formatDate(date),  date 값을 임의의 값으로 설정 추후 date
      imageUrl: logo,
    };
  };

  useEffect(() => {
    // createdAt와 title이 존재하는지 확인합니다.
    if (createdAt && title) {
      // 게시글 데이터를 불러옵니다.
      fetchArticleById(createdAt, title).then((data) => {
        setArticle(data);
      });
    }
  }, [createdAt, title]);

  if (!article) {
    return <div>로딩중...</div>;
  }

  return (
    <ArticleContainer>
      <ArticleTitleMeta>
        <h1>{article.title}</h1>
        <p>
          작성자: {article.username} | 작성일: {article.createdAt}
        </p>
      </ArticleTitleMeta>

      {article.imageUrl && <ArticleImage src={article.imageUrl} alt="게시글 이미지" />}
      <ArticleContent>{article.content}</ArticleContent>

      <CommentForm>
        <input type="text" placeholder="댓글을 입력하세요..." />
        <button type="submit">댓글 작성</button>
      </CommentForm>
      {comments.map((comment) => (
        <CommentItem key={comment.id}>
          <p>{comment.content}</p>
          <p>작성자: {comment.username}</p>
        </CommentItem>
      ))}
    </ArticleContainer>
  );
};

export default Notice;

// styled-components 스타일 정의
const ArticleContainer = styled.div`
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 80px auto 50px;
  max-width: 1200px;
  width: 100%;
`;

const ArticleTitleMeta = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: solid 1px #ddd;
  padding-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 400;
  }

  p {
    font-size: 14px;
    color: #bbb;
  }
`;

const ArticleImage = styled.img`
  display: block;
  max-width: 90%;
  margin: 0 auto;
  height: auto;
  margin-top: 30px;
`;

const ArticleContent = styled.p`
  white-space: pre-line;
  margin-top: 30px;
`;

const CommentForm = styled.form`
  display: flex;
  margin-top: 20px;
  input {
    flex: 1;
    margin-right: 10px;
  }
  button {
    width: 100px;
  }
`;

const CommentItem = styled.div`
  margin-top: 10px;
  p {
    margin: 5px 0;
  }
`;
