import styled from 'styled-components';
import formatDate from './helpers/helpers';
import { INotice } from './ArticleList';
import { auth, db, storage } from '../firebase';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { DeleteButton } from './auth-components';

interface ArticleContentProps {
  article: INotice;
  handleOpenImage: (src: string) => void;
}

const ArticleContent = ({ article, handleOpenImage }: ArticleContentProps) => {
  const user = auth.currentUser;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  return (
    <>
      <ArticleTitleMeta>
        <h1>{article.title}</h1>
        {article.userId === user?.uid && (
          <>
            <Link to={`/notice/${id}/edit`}>수정</Link>
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
      <ArticleText>{article.content}</ArticleText>
    </>
  );
};

export default ArticleContent;

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
    font-weight: 600;
    flex: 1;
  }

  p {
    font-size: 14px;
    color: #bbb;
  }

  a {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      background: #666;
      color: #fff;
    }
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
  max-width: 45%;
  cursor: pointer;
`;

const ArticleText = styled.p`
  white-space: pre-line;
  margin-top: 30px;
`;
