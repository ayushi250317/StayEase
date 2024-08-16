import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {FaEye} from 'react-icons/fa';
import {IoIosHeart} from 'react-icons/io';
import {Separator} from '@/components/ui/separator';
import {queryKeys} from '@src/src/lib/queries';
import {useMutation, useQuery} from '@tanstack/react-query';
import {stayeaseAxios} from '@src/src/lib/client';
import {toast} from 'react-toastify';

export const Wishlist = () => {
  const navigate = useNavigate();

  const propertiesQuery = useQuery({...queryKeys.wishlist.list()});

  const deleteFromWishlistMutation = useMutation({
    mutationFn: (id: string) => stayeaseAxios.post(`wishlist/remove/${id}`),
    onSuccess: () => {
      propertiesQuery.refetch();
      toast.success(`Property removed from wishlist`);
    },
  });

  const removeFromWishList = async (id: string) => {
    deleteFromWishlistMutation.mutate(id);
  };

  return (
    <div className="mt-10 pr-20 pl-20">
      <h1 className="text-3xl font-extralight text-center">❤️ Your Wishlist</h1>
      <Separator className="w-4/12 mx-auto my-5" />

      <div className=" w-full mt-10 flex gap-8">
        <div className="w-9/12 flex flex-wrap gap-8">
          {propertiesQuery?.data?.map((home) => (
            <Card className="w-2/6" key={home.name}>
                  <img
                    className="h-48 w-full object-cover rounded-t-md"
                    src={home.images?.[0]?.img_url}
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{home.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {home.description}
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

                      <Button
                        className="w-1/2"
                        onClick={() => removeFromWishList(home.id)}
                        variant="secondary"
                      >
                        <IoIosHeart className="mr-2" size={18} color="red" />
                        Remove
                      </Button>
                  </CardFooter>
                </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
