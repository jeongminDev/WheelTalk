import { useState } from 'react';
import styled from 'styled-components';
import { Category } from './constants/category';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface WriteModalProps {
  onClose: (event: React.MouseEvent | React.FormEvent) => void;
  theme: string;
}

const WriteModal = ({ onClose, theme }: WriteModalProps) => {
  const [isLoading, setLoading] = useState(false);
  const [category, setCategory] = useState('free'); // 카테고리 상태
  const [brand, setBrand] = useState(''); // 카테고리 선택 후 브랜드 상태
  const [title, setTitle] = useState(''); // 제목 상태
  const [content, setContent] = useState(''); // 본문 상태
  const [images, setImages] = useState<File[]>([]); // 이미지 상태

  const handleCloseBtn = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (title || content) {
      const ok = confirm('작성중인 내용이 사라집니다. 정말 취소하시겠습니까?');
      if (ok) {
        return onClose(event);
      }
    }
    return onClose(event);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = event.target.value;

    // 선택된 브랜드가 없을 경우, 카테고리를 'free'로 설정
    if (!selectedBrand) {
      setCategory('free');
      setBrand(''); // 브랜드 상태도 초기화
    } else {
      // 선택된 브랜드가 있을 경우, 해당 브랜드로 상태 업데이트
      setBrand(selectedBrand);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      const filteredFiles = selectedFiles.filter((file) => file.size <= 1000000);

      if (filteredFiles.length !== selectedFiles.length) {
        alert('일부 이미지 용량이 너무 큽니다.');
      }

      setImages(filteredFiles);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user || isLoading || content === '' || title === '') return;

    try {
      setLoading(true);

      // 브랜드가 선택되지 않았을 때 카테고리를 자유게시판으로 설정
      const finalCategory = brand === '' ? 'free' : category;

      const doc = await addDoc(collection(db, 'notice'), {
        content,
        createdAt: Date.now(),
        username: user.displayName || 'Unknown',
        userId: user.uid,
        title,
        category: finalCategory,
        brand,
        photos: [],
        likes: 0,
      });

      const uploadedImageUrls = [];
      for (const image of images) {
        const locationRef = ref(storage, `notice/${user.uid}/${doc.id}/${image.name}`);
        const result = await uploadBytes(locationRef, image);
        const url = await getDownloadURL(result.ref);
        uploadedImageUrls.push(url);
      }

      await updateDoc(doc, {
        photos: uploadedImageUrls,
      });

      setCategory('free');
      setBrand('All');
      setTitle('');
      setContent('');
      setImages([]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

    // 제출 후 모달 닫기
    onClose(event);
  };

  return (
    <WriteWrap className="write_modal">
      <ModalBox className="modal-box">
        <form onSubmit={handleSubmit}>
          <button
            onClick={handleCloseBtn}
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h2 className="">공유하고 싶은 내용을 적어보세요!!</h2>

          <Label>
            카테고리 선택
            {category === 'category' ? (
              <span className="font-extralight text-xs opacity-50">
                ※ 카테고리를 선택하지 않으면 자유게시판에 자동으로 저장됩니다.
              </span>
            ) : null}
            <div className="select_wrap">
              <Select value={category} onChange={handleCategoryChange}>
                <option value={'free'}>자유게시판</option>
                <option value={'category'}>카테고리 지정</option>
              </Select>
              {category === 'category' ? (
                <Select value={brand} onChange={handleBrandChange}>
                  <option value={''}>--선택해주세요--</option>
                  {Object.entries(Category).map(([key, name]) => (
                    <option key={key} value={name}>
                      {name}
                    </option>
                  ))}
                </Select>
              ) : null}
            </div>
          </Label>
          <Label>
            제목 입력<span>*</span>
            <Input type="text" value={title} onChange={handleTitleChange} required />
          </Label>
          <Label>
            내용<span>*</span>
            <TextArea value={content} onChange={handleContentChange} required />
          </Label>
          <Label className="file">
            이미지 첨부
            {images.length > 0 ? (
              <strong>{images.length}개의 이미지가 등록되었습니다.</strong>
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
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            )}
            <Input type="file" accept="image/*" hidden multiple onChange={handleImageChange} />
          </Label>
          <ButtonContainer theme={theme}>
            <Button type="submit">{isLoading ? '등록중...' : '등록'}</Button>
            <Button type="button" onClick={handleCloseBtn} className="closeBtn">
              취소
            </Button>
          </ButtonContainer>
        </form>
      </ModalBox>
    </WriteWrap>
  );
};

export default WriteModal;

const WriteWrap = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  grid-column-start: 1;
  grid-row-start: 1;
  width: 100%;
  height: 100%;
  max-height: 80vh;
  max-width: 50vw;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  overflow-y: auto;
  overscroll-behavior: contain;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
  }

  .select_wrap {
    display: flex;
    gap: 10px;

    select {
      width: 30%;

      option {
        font-size: 14px;
      }
    }
  }

  .file {
    cursor: pointer;

    &:hover svg {
      background: #ddd;
    }
  }
`;

const Label = styled.label`
  display: block;
  margin: 10px 0;

  span {
    color: #f00;
    font-weight: bold;
    margin-left: 5px;
  }

  svg {
    display: block;
    max-width: 50px;
    border: solid 2px #ddd;
    border-radius: 5px;
    padding: 5px;
    margin-top: 10px;
  }

  strong {
    display: block;
    padding: 5px;
    margin-top: 10px;
    color: #666;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 30vh;
`;

const ButtonContainer = styled.div<{ theme: string }>`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;

  .closeBtn {
    background-color: transparent;
    color: ${({ theme }) => (theme === 'light' ? '#000' : '#fff')};
    border: solid 1px #ccc;

    &:hover {
      color: #fff;
    }
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #535353;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #171717;
  }
`;
