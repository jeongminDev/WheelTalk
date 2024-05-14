import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './Tweet';

export interface ITweet {
  id: string;
  photo: string;
  tweet: string;
  username: string;
  userId: string;
  createdAt: number;
}

const Timeline = () => {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(collection(db, 'tweets'), orderBy('createdAt', 'desc'), limit(10));
      /*
      const snapshot = await getDocs(tweetsQuery);
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, photo } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          photo,
          id: doc.id,
        };
      });
      setTweet(tweets);
    };
  
    */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default Timeline;

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
