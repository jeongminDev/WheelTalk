/*
// 차량 유형을 별도로 정의
const VehicleTypes = {
  sedan: { name: '세단', description: '...' },
  suv: { name: 'SUV', description: '...' },
} as const;

// 브랜드와 차량 유형을 매핑
export const Category: {
  [key: string]: { [type: string]: (typeof VehicleTypes)[keyof typeof VehicleTypes] };
} = {
  benz: {
    car: VehicleTypes.sedan,
    suv: VehicleTypes.suv,
  },
  bmw: {
    car: VehicleTypes.sedan,
    suv: VehicleTypes.suv,
  },
  chevrolet: {
    car: VehicleTypes.sedan,
    suv: VehicleTypes.suv,
  },
  hyundai: {
    car: VehicleTypes.sedan,
    suv: VehicleTypes.suv,
  },
  kia: {
    car: VehicleTypes.sedan,
    suv: VehicleTypes.suv,
  },
  // 나머지 브랜드도 동일하게
} as const;
*/

export const Category: { [key: string]: string } = {
  hyundai: 'HYUNDAI', // 현대
  kia: 'KIA', // 기아
  genesis: 'GENESIS', // 제네시스
  kgmobility: 'KG mobility', // 구 쌍용
  renault: 'Renault', // 구 르노삼성
  benz: 'Benz',
  audi: 'Audi', // 아우디
  bmw: 'BMW',
  volkswagen: 'Volkswagen', // 폭스바겐
  chevrolet: 'Chevrolet',
  ford: 'Ford', // 포드
  tesla: 'Tesla', // 테슬라
  toyota: 'Toyota', // 토요타
  honda: 'Honda', // 혼다
  nissan: 'Nissan', // 닛산
  lexus: 'Lexus', // 렉서스
  etc: 'All', // etc...
} as const;
