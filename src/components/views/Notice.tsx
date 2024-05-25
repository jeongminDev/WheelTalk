import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import formatDate from '../helpers/helpers';
import { INotice } from '../ArticleList';
import {
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
  addDoc,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: number;
  userId: string;
}

const Notice = () => {
  const user = auth.currentUser;
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<INotice | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return; // id가 없으면 반환

      const docRef = doc(db, 'notice', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as INotice;
        setArticle({
          ...data,
          id: docSnap.id,
          createdAt: data.createdAt,
          userId: data.userId,
          username: data.username,
          title: data.title,
          content: data.content,
          category: data.category,
          brand: data.brand,
          photos: data.photos || [],
        });
      } else {
        console.log('No such document!');
      }
    };

    fetchNotice();
  }, [id]);

  const handleReply = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert('로그인 후 작성 가능합니다.');
      setReply('');
      return;
    } else if (reply === '') {
      alert('내용을 작성해주세요.');
      setReply('');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, `notice/${id}/comments`), {
        username: user.displayName || user.email, // 사용자의 이름 또는 이메일을 사용합니다.
        content: reply,
        createdAt: Date.now(),
        userId: user.uid,
      });

      setReply(''); // 댓글을 추가한 후 입력 필드를 초기화합니다.
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const commentsQuery = query(
        collection(db, 'notice', id, 'comments'),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setComments(commentsData);
      });

      return () => unsubscribe();
    }
  }, [id]);

  if (!article) {
    return <div>로딩중...</div>;
  }

  const onDelete = async (commentId: string) => {
    const ok = confirm('정말 이 댓글을 삭제하시겠습니까?');

    if (!ok) return;

    try {
      const commentDocRef = doc(db, 'notice', id!, 'comments', commentId);
      await deleteDoc(commentDocRef);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ArticleWrap>
      <ArticleContainer>
        <ArticleTitleMeta>
          <h1>{article.title}</h1>
          <p>
            작성자: {article.username} | 작성일: {formatDate(article.createdAt)}
          </p>
        </ArticleTitleMeta>

        {article.photos.length > 0 && (
          <ImageGallery>
            {article.photos.map((src, index) => (
              <ArticleImage key={index} src={src} alt={`게시글 이미지 ${index + 1}`} />
            ))}
          </ImageGallery>
        )}
        <ArticleContent>{article.content}</ArticleContent>
        <CommentForm onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={reply}
            onChange={handleReply}
            placeholder="댓글을 입력하세요!"
          />
          <button type="submit">{isLoading ? '등록중..' : '댓글 등록'}</button>
        </CommentForm>
      </ArticleContainer>
      {comments.length > 0 && (
        <CommentWrap>
          <h3 className="font-bold text-xl">Comment</h3>
          {comments.map((comment) => (
            <CommentItem key={comment.id}>
              <div>
                <span>
                  <svg
                    fill="none"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  {comment.username}
                </span>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <div>
                <p>{comment.content}</p>
                {comment.userId === user?.uid && (
                  <>
                    <button>수정</button>
                    <button onClick={() => onDelete(comment.id)}>삭제</button>
                  </>
                )}
              </div>
            </CommentItem>
          ))}
        </CommentWrap>
      )}
    </ArticleWrap>
  );
};

export default Notice;

const ArticleWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 80px auto 50px;
  max-width: 1200px;
  width: 100%;
`;

const ArticleContainer = styled.div`
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
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

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 20px;
`;

const ArticleImage = styled.img`
  display: block;
  max-width: 40%;
`;

const ArticleContent = styled.p`
  white-space: pre-line;
  margin-top: 30px;
`;

const CommentForm = styled.form`
  display: flex;
  margin-top: 40px;
  input {
    flex: 1;
    margin-right: 10px;
    outline: none;
    padding: 10px;
    font-size: 14px;
    border: solid 1px #eee;
    border-radius: 4px;

    &:focus {
      border: solid 1px #aaa;
    }
  }
  button {
    width: auto;
    padding: 10px;
    border: solid 1px #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: 0.2s;
    &:hover {
      background: #666;
      color: #fff;
    }
  }
`;

const CommentWrap = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const CommentItem = styled.div`
  padding: 10px 0;
  div {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    span {
      display: flex;
      align-items: center;

      svg {
        max-width: 20px;
      }

      &:first-child {
        flex: 1;
        font-size: 14px;
      }

      &:last-child {
        color: #bbb;
      }
    }
  }
  p {
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    flex: 1;
  }
  button {
    margin-top: 10px;
    padding: 0 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: 0.2s;
    &:hover {
      background: #666;
      color: #fff;
    }
  }
`;
