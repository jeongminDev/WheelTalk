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
