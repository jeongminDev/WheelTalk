import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import { deleteObject, ref } from 'firebase/storage';
import { DeleteButton } from '../auth-components';

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
  const [imgModal, setImgModal] = useState('');
  const [likes, setLikes] = useState(false);
  const navigate = useNavigate();

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
          likes: data.likes,
        });

        // Check if the current user has liked this article
        if (user) {
          const likeDocRef = doc(db, `notice/${id}/likes`, user.uid);
          const likeDocSnap = await getDoc(likeDocRef);
          if (likeDocSnap.exists()) {
            setLikes(true);
          }
        }
      } else {
        console.log('No such document!');
      }
    };

    fetchNotice();
  }, [id, user]);

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
        username: user.displayName || 'Unknown', // 사용자의 이름 또는 이메일을 사용합니다.
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

  const onArticleDelete = async () => {
    const ok = confirm('이 게시글을 삭제하시겠습니까?');

    if (!ok || user?.uid !== article?.userId || !id) return;

    try {
      await deleteDoc(doc(db, 'notice', id));

      // 게시글에 포함된 사진 삭제
      if (article.photos && article.photos.length > 0) {
        for (const photoUrl of article.photos) {
          const photoRef = ref(storage, photoUrl);
          await deleteObject(photoRef);
        }
      }

      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

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

  const handleOpenImage = (src: string) => {
    setImgModal(src);
  };

  const handleCloseImages = () => {
    setImgModal('');
  };

  const handleLikes = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!article || !user) return;

    try {
      const docRef = doc(db, 'notice', article.id);
      const likeDocRef = doc(db, `notice/${article.id}/likes`, user.uid);

      if (likes) {
        // 좋아요 취소
        await deleteDoc(likeDocRef);
        await updateDoc(docRef, {
          likes: article.likes - 1, // 좋아요 수 감소
        });

        setArticle((prevArticle) =>
          prevArticle ? { ...prevArticle, likes: prevArticle.likes - 1 } : prevArticle
        );
        setLikes(false);
      } else {
        // 좋아요 추가
        await setDoc(likeDocRef, {
          userId: user.uid,
        });
        await updateDoc(docRef, {
          likes: article.likes + 1, // 좋아요 수 증가
        });

        setArticle((prevArticle) =>
          prevArticle ? { ...prevArticle, likes: prevArticle.likes + 1 } : prevArticle
        );
        setLikes(true);
      }
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  return (
    <ArticleWrap>
      <ArticleContainer>
        <ArticleTitleMeta>
          <h1>{article.title}</h1>
          {article.userId === user?.uid && (
            <>
              {/* <button>수정</button> */}
              <DeleteButton onClick={onArticleDelete}>삭제</DeleteButton>
            </>
          )}
          <p>
            작성자: {article.username} | 작성일: {formatDate(article.createdAt)}
          </p>
        </ArticleTitleMeta>

        {article.photos.length > 0 && (
          <ImageGallery>
            {article.photos.map((src, index) => (
              <ArticleImage
                onClick={() => handleOpenImage(src)}
                key={index}
                src={src}
                alt={`게시글 이미지 ${index + 1}`}
              />
            ))}
          </ImageGallery>
        )}
        <ArticleContent>{article.content}</ArticleContent>
        <CommentAndLikesWrapper>
          <CommentForm onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={reply}
              onChange={handleReply}
              placeholder="댓글을 입력하세요!"
            />
            <button type="submit">{isLoading ? '등록중..' : '댓글 등록'}</button>
          </CommentForm>
          {user && article.userId !== user?.uid ? (
            <LikesWrap>
              <button onClick={handleLikes}>
                {likes ? (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M2 6.342a3.375 3.375 0 0 1 6-2.088 3.375 3.375 0 0 1 5.997 2.26c-.063 2.134-1.618 3.76-2.955 4.784a14.437 14.437 0 0 1-2.676 1.61c-.02.01-.038.017-.05.022l-.014.006-.004.002h-.002a.75.75 0 0 1-.592.001h-.002l-.004-.003-.015-.006a5.528 5.528 0 0 1-.232-.107 14.395 14.395 0 0 1-2.535-1.557C3.564 10.22 1.999 8.558 1.999 6.38L2 6.342Z" />
                  </svg>
                ) : (
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
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </button>
            </LikesWrap>
          ) : null}
        </CommentAndLikesWrapper>
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
                    {/* <button>수정</button> */}
                    <button onClick={() => onDelete(comment.id)}>삭제</button>
                  </>
                )}
              </div>
            </CommentItem>
          ))}
        </CommentWrap>
      )}
      {imgModal && (
        <NoticeModal className="notice_modal" onClick={handleCloseImages}>
          <img src={imgModal} alt="게시물 이미지" />
        </NoticeModal>
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
  gap: 15px;

  h1 {
    font-size: 24px;
    font-weight: 400;
    flex: 1;
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
  cursor: pointer;
`;

const ArticleContent = styled.p`
  white-space: pre-line;
  margin-top: 30px;
`;

const CommentAndLikesWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  align-items: center;
  gap: 10px;
`;

const LikesWrap = styled.div`
  min-height: 35px;
  min-width: 35px;
  button {
    width: 100%;
  }
`;

const CommentForm = styled.form`
  flex: 1;
  display: flex;
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

const NoticeModal = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 70vw;
  max-height: 60vw;
  z-index: 21;
  background: #fff;
  padding: 30px;
  box-shadow: 0 3px 4px 0 #666;

  img {
    z-index: 22;
    cursor: pointer;
    max-width: 100%;
    border: solid 2px #ccc;
  }
`;
