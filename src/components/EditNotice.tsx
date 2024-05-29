import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';
import { Category } from './constants/category';

const EditNotice = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('free');
  const [brand, setBrand] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;

      const docRef = doc(db, 'notice', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setBrand(data.brand);
      } else {
        console.log('No such document!');
      }
    };

    fetchNotice();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, 'notice', id!);
      await updateDoc(docRef, {
        title,
        content,
        category,
        brand,
      });

      navigate(`/notice/${id}`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
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

  return (
    <EditForm onSubmit={handleSubmit}>
      <Label>
        카테고리 선택
        {category === 'category' ? (
          <span className="font-extralight text-xs opacity-50">
            ※ 카테고리를 선택하지 않으면 자유게시판에 자동으로 저장됩니다.
          </span>
        ) : null}
        <div className="select_wrap">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        제목:
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Label>
      <label>
        내용:
        <TextArea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '업데이트 중...' : '업데이트'}
      </Button>
    </EditForm>
  );
};

export default EditNotice;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 30px auto 0;
  gap: 20px;

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
`;

const Label = styled.label`
  display: block;

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
