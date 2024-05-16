import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import slideImg01 from '../assets/images/banner01.png';
import slideImg02 from '../assets/images/banner02.png';
import slideImg03 from '../assets/images/banner03.png';

/**
 * Slider를 라이브러리를 활용하셔도 되지만 시간이 남는다면 직접하셔서 구현 해보세요.
 */
const Slider = () => {
  const items = [
    {
      name: 'banner01',
      img: slideImg01,
      bg: '#e5e5e5',
    },
    {
      name: 'banner02',
      img: slideImg02,
      bg: '#2e2a23',
    },
    {
      name: 'banner03',
      img: slideImg03,
      bg: '#00002c',
    },
  ];

  interface ISliderItem {
    readonly name: string;
    readonly img: string;
    readonly bg: string;
  }

  return (
    <Carousel
      autoPlay
      showThumbs={false}
      interval={6000}
      showStatus={false}
      infiniteLoop={true}
      className="carousel-container"
    >
      {items.map((item: ISliderItem, index: number) => {
        return (
          <div
            key={index}
            className="carousel-slide"
            style={{
              backgroundColor: `${item.bg}`,
            }}
          >
            <img src={item.img} alt={item.name} />
          </div>
        );
      })}
    </Carousel>
  );
};

export default Slider;
