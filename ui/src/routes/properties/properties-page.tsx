import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {amenities} from '@/lib/data';
import {SelectTrigger} from '@radix-ui/react-select';
import {Loading} from '@src/src/components/loading';
import {Propertytype} from '@src/src/lib/dto';
import {queryKeys} from '@src/src/lib/queries';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {FaCheck, FaEye, FaSort, FaTimes} from 'react-icons/fa';
import {IoIosArrowDropdown, IoIosHeart} from 'react-icons/io';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Filter, filterAndSortProperties, SortBy} from './filters';
import {stayeaseAxios} from '@src/src/lib/client';
import {toast} from 'react-toastify';

export const StayPlacesProperties = () => {
  const navigate = useNavigate();

  const [search] = useSearchParams();

  const propertiesQuery = useQuery({...queryKeys.property.list()});

  const [filter, setFilters] = useState<Filter>({});

  const [sortBy, setSortBy] = useState<SortBy | null>();

  useEffect(() => {
    const query = new URLSearchParams(search);

    const filtersFromQuery: Filter = {};

    if (query.get('name')) {
      filtersFromQuery.name = query.get('name')!;
    }

    if (query.get('type')) {
      filtersFromQuery.type = query.get('type')!.split(',');
    }

    if (query.get('priceMin') || query.get('priceMax')) {
      filtersFromQuery.price = {
        min: query.get('priceMin') ? Number(query.get('priceMin')) : undefined,
        max: query.get('priceMax') ? Number(query.get('priceMax')) : undefined,
      };
    }

    if (query.get('amenities')) {
      filtersFromQuery.amenities = query.get('amenities')!.split(',');
    }

    if (query.get('bed')) {
      filtersFromQuery.bed = Number(query.get('bed'));
    }

    setFilters(filtersFromQuery);

    const sortByQuery = query.get('sortBy');
    if (
      sortByQuery === SortBy.PRICE_HIGH_TO_LOW ||
      sortByQuery === SortBy.PRICE_LOW_TO_HIGH
    ) {
      setSortBy(sortByQuery as SortBy);
    }
  }, [search]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addToWishList = async (id: string) => {
    addToWishlistMutation.mutate(id);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeFromWishList = async (id: string) => {
    removeFromWishlistMutation.mutate(id);
  };

  const addToWishlistMutation = useMutation({
    mutationFn: (id: string) => stayeaseAxios.post(`wishlist/add/${id}`),
    onSuccess: () => {
      propertiesQuery.refetch();
      toast.success(`Property Added to wishlist`);
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: string) => stayeaseAxios.post(`wishlist/remove/${id}`),
    onSuccess: () => {
      propertiesQuery.refetch(),
        toast.success(`Property Removed from wishlist`);
    },
  });

  const properties = filterAndSortProperties(
    propertiesQuery.data || [],
    filter,
    sortBy,
  );

  console.log(propertiesQuery.data);

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-2xl md:text-3xl font-extralight text-center">
        🏠 Find Your Perfect Place: Top Rental Gems in Your City!
      </h1>
      <Separator className="w-full md:w-5/12 mx-auto my-5" />

      <div className="flex items-center gap-2 md:gap-5 flex-wrap">
        {filter?.type?.map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="flex items-center gap-2 w-fit"
            onClick={() =>
              setFilters({
                ...filter,
                type: filter.type?.filter((_t) => _t !== t),
              })
            }
          >
            Type: {t} <FaTimes />
          </Badge>
        ))}

        {typeof filter?.price?.min === 'number' && (
          <Badge
            onClick={() => {
              const _filter = {...filter};

              delete _filter?.price?.min;

              setFilters(_filter);
            }}
            variant="secondary"
            className="flex items-center gap-2 w-fit"
          >
            Min Price: {filter.price.min}$ <FaTimes />
          </Badge>
        )}

        {typeof filter?.price?.max === 'number' && (
          <Badge
            onClick={() => {
              const _filter = {...filter};

              delete _filter?.price?.max;

              setFilters(_filter);
            }}
            variant="secondary"
            className="flex items-center gap-2 w-fit"
          >
            Max Price: {filter.price.max}$ <FaTimes />
          </Badge>
        )}

        {(filter?.bed || 0) > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-2 w-fit"
            onClick={() => setFilters({...filter, bed: 0})}
          >
            Beds: {filter.bed} <FaTimes />
          </Badge>
        )}

        {filter?.amenities?.map((a) => (
          <Badge
            onClick={() =>
              setFilters({
                ...filter,
                amenities: filter.amenities?.filter((_t) => _t !== a),
              })
            }
            key={a}
            variant="secondary"
            className="flex items-center gap-2 w-fit"
          >
            Amenity: {a} <FaTimes />
          </Badge>
        ))}

        {!!sortBy && (
          <Badge
            onClick={() => setSortBy(null)}
            variant="secondary"
            className="flex items-center gap-2 w-fit"
          >
            Sort By: {sortBy} <FaTimes />
          </Badge>
        )}
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
        <Card className="w-full md:w-[22%] h-fit">
          <CardContent className="pt-4">
            <h4 className="mb-2">Search: </h4>
            <Input
              value={filter?.name}
              onChange={(e) => setFilters({...filter, name: e.target.value})}
              placeholder="search"
            />

            <h4 className="mt-4 mb-2">Type: </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  Room Type <IoIosArrowDropdown className="text-lg" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                {Object.values(Propertytype).map((roomType) => (
                  <DropdownMenuCheckboxItem
                    checked={filter?.type?.includes(roomType)}
                    key={roomType}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filter,
                          type: [...(filter?.type || []), roomType],
                        });
                      } else {
                        setFilters({
                          ...filter,
                          type: filter?.type?.filter((t) => t !== roomType),
                        });
                      }
                    }}
                  >
                    {roomType}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <h4 className="mt-4 mb-2">Price: </h4>
            <Input
              type="number"
              placeholder="Min $"
              min={0}
              value={filter?.price?.min || 0}
              onChange={(e) =>
                setFilters({
                  ...filter,
                  price: {
                    ...(filter.price || {}),
                    min: +e.target.value,
                  },
                })
              }
            />
            <Input
              type="number"
              placeholder="Max $"
              className="mt-2"
              min={0}
              value={filter?.price?.max || 0}
              onChange={(e) =>
                setFilters({
                  ...filter,
                  price: {
                    ...(filter.price || {}),
                    max: +e.target.value,
                  },
                })
              }
            />

            <h4 className="mt-4 mb-2">Beds</h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((beds) => (
                <Badge
                  variant={filter?.bed === beds ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => {
                    if (filter?.bed === beds) {
                      setFilters({...filter, bed: undefined});
                      return;
                    }
                    setFilters({...filter, bed: beds});
                  }}
                >
                  {beds} beds
                </Badge>
              ))}
            </div>

            <h4 className="mt-4 mb-2">Amenities: </h4>
            {amenities.map((amenity) => (
              <div className="flex items-center gap-2" key={amenity.label}>
                <Checkbox
                  checked={filter?.amenities?.includes(amenity.label)}
                  icon={<FaCheck />}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters({
                        ...filter,
                        amenities: [
                          ...(filter?.amenities || []),
                          amenity.label,
                        ],
                      });
                    } else {
                      setFilters({
                        ...filter,
                        amenities:
                          filter?.amenities?.filter(
                            (a) => a !== amenity.label,
                          ) || [],
                      });
                    }
                  }}
                />
                <amenity.icon />
                <span className="text-sm">{amenity.label}</span>
              </div>
            ))}

            <h4 className="mt-4 mb-2">Sort By:</h4>
            <Select onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-full">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  Sort By <FaSort className="text-lg" />
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(SortBy).map((sort) => (
                    <SelectItem key={sort} value={sort}>
                      {sort}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertiesQuery.isFetching && <Loading />}
            {!properties?.length && <h4>No properties found.</h4>}
            {!propertiesQuery.isFetching &&
              properties?.map((home) => (
                <Card key={home.name}>
                  <img
                    className="h-48 w-full object-cover rounded-t-md"
                    src={home.images?.[0]?.img_url}
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{home.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {home.description?.slice(0, 100)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex text-xs">
                      <span className="font-semibold">${home.price}/Night</span>
                      <span className="flex gap-2 ml-auto">
                        <span>📍</span> {home.location}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-1/2 m-1"
                      onClick={() => navigate(`/property/${home.id}`)}
                    >
                      <FaEye className="mr-4" />
                      View
                    </Button>
                    {home.wishList ? (
                      <Button
                        className="w-1/2"
                        onClick={() => removeFromWishList(home.id)}
                        variant="secondary"
                      >
                        <IoIosHeart className="mr-2" size={18} color="red" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        className="w-1/2"
                        onClick={() => addToWishList(home.id)}
                        variant="secondary"
                      >
                        <IoIosHeart className="mr-2" size={18} color="red" />
                        Add
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
