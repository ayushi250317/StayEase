import {Loading} from '@src/src/components/loading';
import {Button} from '@src/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/src/components/ui/card';
import {stayeaseAxios} from '@src/src/lib/client';
import {queryKeys} from '@src/src/lib/queries';
import {useMutation, useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {FaEye, FaTrash} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const ManagePropertyPage = () => {
  const navigate = useNavigate();

  const myPropertiesQuery = useQuery(queryKeys.property.my());

  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) => stayeaseAxios.delete(`property/delete/${id}`),
    onSuccess: () => myPropertiesQuery.refetch(),
  });

  return (
    <>
      <h1 className="text-primary text-center">Manage Properties</h1>

      <div className="w-full md:w-3/4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPropertiesQuery.isFetching && <Loading />}
          {!myPropertiesQuery.isFetching &&
            myPropertiesQuery.data?.map((home) => {
              const duration = dayjs(home.registrationTime).fromNow();

              return (
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
                    <div className="mt-2">
                      <span className="font-light text-xs">
                        Posted {duration}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-1/2 m-1"
                      onClick={() =>
                        navigate(`/property/${home.property.propertyId}`)
                      }
                    >
                      <FaEye className="mr-4" />
                      View
                    </Button>

                    <Button
                      className="ml-auto"
                      variant="outline"
                      onClick={() => deletePropertyMutation.mutate(home.id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      </div>
    </>
  );
};
