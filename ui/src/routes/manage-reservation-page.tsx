import {useMutation, useQuery} from '@tanstack/react-query';
import {FaCalendar, FaDollarSign, FaEye, FaBan} from 'react-icons/fa';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {queryKeys} from '@src/src/lib/queries';
import {Loading} from '@src/src/components/loading';
import {stayeaseAxios} from '@src/src/lib/client';
import DeclineReservationModal from '@src/modals/DeclineReservationModal';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

export type declineReservationData = {
  bookingId: number;
  reason: string;
};

export const ManageReservationPage = () => {
  const navigate = useNavigate();

  const myReservationsQuery = useQuery(queryKeys.reservations.get());

  const declineReservation = useMutation({
    mutationFn: (data: declineReservationData) =>
      stayeaseAxios.post('booking/decline', data),
    onSuccess: () => {
      toast.success('Reservation declined successfully.');
      myReservationsQuery.refetch();
    },
    onError: () => {
      toast.error('Reservation declined failed.');
    },
  });

  return (
    <>
      <h1 className="text-primary text-center">Manage Reservations</h1>
      <div className="mt-10">
        <div className="mt-8 flex flex-wrap gap-8">
          {myReservationsQuery.isFetching && <Loading />}
          {!myReservationsQuery.isFetching &&
            myReservationsQuery.data?.map((home) => (
              <Card key={home.bookingId} className="lg:w-3/12 md:w-5/12">
                <img
                  className="h-auto w-full rounded-md"
                  src={home.images[0].img_url}
                />
                <CardHeader>
                  <CardTitle>{home.propertyName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-2 text-xs">
                    <FaCalendar />
                    <span>July 10th to July 15th 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FaDollarSign />
                    <span className="font-semibold">
                      {home.property?.price}
                    </span>
                    <span className="flex gap-2 ml-auto">
                      <span>📍</span> {home.property?.location}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="gap-5 flex-col">
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/property/${home.property.propertyId}`)
                    }
                  >
                    <FaEye className="mr-4" />
                    Details
                  </Button>
                  {!home?.declineReason ? (
                    <DeclineReservationModal
                      bookingId={home.bookingId}
                      declineMutation={declineReservation}
                    />
                  ) : (
                    <Button disabled variant="secondary" className="w-full">
                      <FaBan className="mr-4" />
                      Already Declined
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};
