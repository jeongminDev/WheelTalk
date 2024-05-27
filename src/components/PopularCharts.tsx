import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PopularCharts = () => {
  // TODO search 검색어 순위 및 게시글 좋아요 기능 구현시 순위 (Tweet.tsx 참고)
  const ranking = Array.from({ length: 10 }, (_, index) => ({
    likes: 999,
    title: '검색어 및 게시글' + `${index}`,
  }));

  interface IRanking {
    readonly likes: number;
    readonly title: string;
  }

  return (
    <Wrapper>
      <ChartList>
        <Title>실시간 검색어 or 게시글 순위</Title>
        <Ranking>
          {ranking.map((rank: IRanking, index: number) => {
            return (
              <Link to={'/list'} key={index}>
                <em>{index + 1}</em>
                <p>{rank.title}</p>
                <span>{rank.likes + 2 - index * 17}</span>
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
