import {FaSwimmingPool, FaTv, FaUtensilSpoon, FaWifi} from 'react-icons/fa';
import {PriceBase, StayPlace} from './types';
import {IoFastFood} from 'react-icons/io5';

export const users = [
  {
    email: 'mayursiinh@gmail.com',
    registeredAt: new Date(),
  },
  {
    email: 'mayursiinh+1@gmail.com',
    registeredAt: new Date('2024/01/01'),
  },
];

export const database: StayPlace[] = [
  {
    id: '0',
    title: 'Spacious oceanfront home',
    description: 'Beach and ocean views',
    price: {
      value: 30,
      base: PriceBase.PER_NIGHT,
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/cdddfa05-cac2-4e69-886a-fc4050c28a58.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/e6d8d851-e374-4072-b8ab-8b11cc9b6502.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/f60515e1-a907-42fc-a269-a6185a1c5ad7.png?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/136d897c-b42b-4475-93d4-c9cf7b82c4e9.png?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/9a4f2087-b9b4-4424-947d-35c572f70e2c.png?im_w=720',
    ],
    location: 'Bathurst, Canada',
    amenitiesExclusions: ['TV', 'Wifi', 'Kitchen Utilities'],
    amenities: ['TV', 'Wifi', 'Kitchen Utilities'],
    coords: {
      lat: 44.648766,
      lng: -63.575237,
    },
    owner: users[0],
  },
  {
    id: '1',
    title: 'Spacious oceanfront home',
    description: 'Beach and ocean views',
    price: {
      value: 3800,
      base: PriceBase.PER_NIGHT,
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/cdddfa05-cac2-4e69-886a-fc4050c28a58.jpeg?im_w=720',
    ],
    location: 'Bathurst, Canada',
    amenities: ['TV', 'Wifi', 'Kitchen Utilities'],
    coords: {
      lat: 44.64583,
      lng: -63.626118,
    },
    owner: users[1],
  },
  {
    id: '3',
    title: 'Spacious oceanfront home',
    description: 'Beach and ocean views',
    price: {
      value: 10,
      base: PriceBase.PER_NIGHT,
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/cdddfa05-cac2-4e69-886a-fc4050c28a58.jpeg?im_w=720',
    ],
    location: 'Bathurst, Canada',
    amenities: ['TV', 'Wifi', 'Kitchen Utilities'],
    coords: {
      lat: 44.628241,
      lng: -63.573246,
    },
    owner: users[1],
  },
  {
    id: '5',
    title: 'Spacious oceanfront home',
    description: 'Beach and ocean views',
    price: {
      value: 380,
      base: PriceBase.PER_NIGHT,
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/cdddfa05-cac2-4e69-886a-fc4050c28a58.jpeg?im_w=720',
    ],
    location: 'Bathurst, Canada',
    amenities: ['TV', 'Wifi', 'Kitchen Utilities'],
    coords: {
      lat: 44.629391,
      lng: -63.615037,
    },
    owner: users[0],
  },
  {
    id: '6',
    title: 'Spacious oceanfront home',
    description: 'Beach and ocean views',
    price: {
      value: 50,
      base: PriceBase.PER_NIGHT,
    },
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-52580311/original/cdddfa05-cac2-4e69-886a-fc4050c28a58.jpeg?im_w=720',
    ],
    location: 'Rajkot, India',
    amenities: ['TV', 'Wifi', 'Kitchen Utilities'],
    coords: {
      lat: 22.28708,
      lng: 70.782153,
    },
    owner: users[1],
  },
];

export const amenities = [
  {
    label: 'TV',
    icon: FaTv,
    key: 'tv',
  },
  {
    label: 'Wifi',
    icon: FaWifi,
    key: 'wifi',
  },
  {
    label: 'Breakfast',
    icon: IoFastFood,
    key: 'breakfast',
  },
  {
    label: 'Kitchen Utilities',
    icon: FaUtensilSpoon,
    key: 'kitchen-utilities',
  },
  {
    label: 'Pool',
    icon: FaSwimmingPool,
    key: 'pool',
  },
];

export enum RoomType {
  VILLA = 'VILLA',
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
}

export const admin = {
  reservations: [
    {
      id: '1',
      guest: 'mayursiinh@gmail.com',
      room: {
        type: RoomType.APARTMENT,
        location: 'Halifax, Canada',
      },
      paid: 100,
      stayInNights: 7,
    },
    {
      id: '2',
      guest: 'mayursiinh+1@gmail.com',
      room: {
        type: RoomType.HOUSE,
        location: 'Halifax, Canada',
      },
      paid: 200,
      stayInNights: 2,
    },
  ],
};

export const userBookings: Array<{
  room: StayPlace;
  id: string;
  paid: number;
  checkIn: Date;
  checkOut: Date;
  result: 'DONE' | 'CANCEL';
}> = [
  {
    room: database[0],
    id: '1',
    paid: 2000,
    checkIn: new Date('2024/01/01'),
    checkOut: new Date('2024/01/07'),
    result: 'DONE',
  },
  {
    room: database[1],
    id: '2',
    paid: 2400,
    checkIn: new Date('2024/01/01'),
    checkOut: new Date('2024/01/07'),
    result: 'CANCEL',
  },
  {
    room: database[4],
    id: '3',
    paid: 2000,
    checkIn: new Date('2024/01/01'),
    checkOut: new Date('2024/01/07'),
    result: 'DONE',
  },
];
