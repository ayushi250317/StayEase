import {Button} from '@src/src/components/ui/button';
import {FaSearch, FaArrowRight, FaStar} from 'react-icons/fa';
import {useState} from 'react';
import {cn} from '@src/src/lib/utils';
import {Input} from '@src/src/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@src/src/components/ui/dropdown-menu';
import SearchAndCompare from '@src/assets/search_and_compare.svg';
import BookInstantly from '@src/assets/book_instantly.svg';
import EnjoyStay from '@src/assets/enjoy_stay.svg';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/src/components/ui/card';
import {useNavigate} from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: '',
    adults: 0,
  });

  return (
    <div className="lg:w-8/12 mx-auto">
      <h1 className="text-center text-primary">Find Your Ideal Stay Now!</h1>
      <div className="rounded-md mt-10 w-8/12 md:w-6/12 lg:w-5/12 flex flex-col gap-2 mx-auto">
        <Input
          placeholder="Enter location"
          value={search.location || ''}
          onChange={(e) => setSearch({...search, location: e.target.value})}
        />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="w-full">
              {search.adults} Beds
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="p-5 flex gap-5 items-center">
              <Button
                onClick={() => {
                  if (search.adults - 1 >= 0) {
                    setSearch({...search, adults: search.adults - 1});
                  }
                }}
              >
                -
              </Button>
              {search.adults}
              <Button
                onClick={() =>
                  setSearch({...search, adults: search.adults + 1})
                }
              >
                +
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="secondary"
          className="w-full gap-4"
          onClick={() =>
            navigate(`/properties?name=${search.location}&bed=${search.adults}`)
          }
        >
          <FaSearch />
          Search
        </Button>
      </div>

      <div className="mt-16">
        <h2>Popular Destinations: </h2>

        <div className="flex flex-col md:flex-row mt-5 gap-10 flex-wrap">
          {[
            {
              src: 'https://images.unsplash.com/photo-1580764330084-7729b21ae9e2',
              location: 'Halifax',
            },
            {
              src: 'https://images.unsplash.com/photo-1624236028842-88acfd4e5287',
              location: 'San Fransisco',
            },
            {
              src: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
              location: 'Prague',
            },
            {
              src: 'https://images.unsplash.com/photo-1596796679119-7cf1a9e5448b',
              location: 'Bangalore',
            },
          ].map((data) => (
            <div
              className="md:w-5/12 cursor-pointer hover:text-primary"
              onClick={() =>
                navigate(`/properties-by-location?location=${data.location}`)
              }
            >
              <img
                src={data.src}
                className="h-44 w-full object-cover rounded-md"
              />
              <p className="flex items-center gap-1">
                {data.location} <FaArrowRight className="text-sm" />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2>How it works:</h2>

        <div className="mt-20 flex flex-col gap-28">
          {[
            {
              Svg: SearchAndCompare,
              title: '👀 Search and Compare',
              description:
                'Enter your destination and dates to browse various stay options.',
            },
            {
              Svg: BookInstantly,
              title: '🏨 Book Instantly',
              description:
                'Choose your preferred stay and complete the booking in a few clicks.',
            },
            {
              Svg: EnjoyStay,
              title: '🥰 Enjoy Your Stay',
              description:
                'Experience a seamless and comfortable temporary stay.',
            },
          ].map((data, idx) => (
            <div
              key={data.title}
              className={cn('flex justify-around items-center gap-10', {
                'flex-row-reverse': idx % 2,
              })}
            >
              <img className="w-4/12" src={data.Svg} />
              <div>
                <b>{data.title}</b>
                <p className="text-sm mute">{data.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2>💁💁‍♀️ Testimonials</h2>

        <div className="mt-10 flex flex-col md:flex-row gap-10">
          {[
            {
              name: 'Sarah T.',
              feedback:
                'StayEase made finding a temporary home so effortless! The booking process was quick, and the stay exceeded my expectations. Highly recommended!',
            },
            {
              name: 'Michael R.',
              feedback: `I had an amazing experience with StayEase. The property was exactly as described, and the customer service was top-notch. I'll definitely use it again for my next trip!`,
            },
          ].map((rating, idx) => (
            <Card key={idx} className="md:w-1/2">
              <CardHeader>
                <CardTitle>{rating.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{rating.feedback}</p>
              </CardContent>
              <CardFooter>
                <div className="flex">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
