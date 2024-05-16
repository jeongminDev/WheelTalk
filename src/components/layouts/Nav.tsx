import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { styled } from 'styled-components';
import logoImg from '../../assets/images/logo_B.png';
import { useEffect, useState, useRef } from 'react';

const Nav = () => {
  const user = auth.currentUser;
  // console.log(user);

  const navigate = useNavigate();
  const onLogOut = async () => {
    const ok = confirm('정말 로그아웃 하겠습니까?');

    if (ok) {
      await auth.signOut();
      navigate('/');
    }
  };

  // 광고 문구들
  const ads = [
    '속도감 있는 대화, 여기서 시작됩니다.',
    '바퀴 아래 숨겨진 이야기, 여러분과 함께 나누고 싶습니다.',
    '바퀴달린수다, 당신의 자동차 생활을 더 풍부하게.',
  ];
  // 현재 보여지는 광고 문구의 인덱스
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const adsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex: number) => (prevIndex + 1) % ads.length);
    }, 6000);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [ads.length]);

  useEffect(() => {
    if (adsRef.current) {
      adsRef.current.style.transition = 'transform 0.5s ease-in-out';
      adsRef.current.style.transform = `translateY(-${currentAdIndex * 100}%)`;
    }
  }, [currentAdIndex]);

  return (
    <>
      <SubBanner>
        <BannerList ref={adsRef}>
          {ads.map((ad, index) => (
            <BannerItem key={index}>{ad}</BannerItem>
          ))}
        </BannerList>
      </SubBanner>
      <Wrapper>
        <Link
          to={'/'}
          style={{
            maxWidth: '110px',
          }}
        >
          <Logo src={logoImg}></Logo>
        </Link>

        <MainMenu>
          <Link to={'/'}>
            <MainMenuItem className="font-bold">HOME</MainMenuItem>
          </Link>
          {/* TODO category별 차량 게시판 category.ts 참조 */}
          <Link to={'/free'}>
            <MainMenuItem>자유게시판</MainMenuItem>
          </Link>
        </MainMenu>

        <UtilMenu>
          <label className="flex cursor-pointer gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input type="checkbox" value="retro" className="toggle theme-controller" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
          {user === null ? (
            <>
              <Link to={'/join'}>
                <UtilItem>회원가입</UtilItem>
              </Link>
              <Link to={'/login'}>
                <UtilItem>로그인</UtilItem>
              </Link>
            </>
          ) : (
            <>
              <UtilItem>글쓰기</UtilItem>
              <UtilItem onClick={onLogOut} className="log-out">
                로그아웃
              </UtilItem>
            </>
          )}
        </UtilMenu>
      </Wrapper>
      <Outlet />
    </>
  );
};

export default Nav;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  width: 100%;
  max-width: 1200px;
  justify-content: space-between;
  align-items: center;
`;

const MainMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MainMenuItem = styled.div`
  padding: 5px;
  cursor: pointer;
  width: auto;
  font-size: 14px;
`;

const UtilMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
`;

const UtilItem = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  border: solid 1px #ddd;
  width: auto;
  font-size: 14px;
  border-radius: 5px;
  transition: 0.1s;
  &:hover {
    background-color: #666;
    color: white;
  }
`;

const SubBanner = styled.div`
  height: 35px;
  overflow: hidden;
  width: 100%;
  background-color: #ddd;
`;

const BannerList = styled.ul`
  width: 90%;
  margin: 0 auto;
  text-align: center;
  list-style: none;
  padding: 0;
  height: 35px;
`;

const BannerItem = styled.li`
  padding: 10px;
  font-size: 14px;
  height: 35px;
`;

const Logo = styled.img`
  display: block;
  width: 100%;
`;
