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
import {FaCheckCircle, FaEye, FaStopCircle, FaTrash} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import {cx} from 'class-variance-authority';

dayjs.extend(relativeTime);

export const ManageTripsPage = () => {
  const navigate = useNavigate();

  const myPropertiesQuery = useQuery(queryKeys.history.upcomming());

  const deletePropertyMutation = useMutation({
    mutationFn: (id: string) =>
      stayeaseAxios.post(`booking/cancel`, {bookingId: id, reason: 'N/A'}),
    onSuccess: () => myPropertiesQuery.refetch(),
  });

  return (
    <>
      <h1 className="text-primary text-center">Manage Upcoming Trips</h1>

      <div className="w-full md:w-3/4 mt-10">
        <div className="flex gap-6 items-center">
          {myPropertiesQuery.isFetching && <Loading />}
          {!myPropertiesQuery.isFetching &&
            myPropertiesQuery.data?.map((trip) => {
              return (
                <Card key={trip.property.propertyId}>
                  <CardContent className="p-4 relative">
                    <Button
                      className="absolute right-4"
                      variant="outline"
                      onClick={() =>
                        navigate(`/property/${trip.property.propertyId}`)
                      }
                    >
                      <FaEye />
                    </Button>
                    <div className="flex gap-10 items-center">
                      <img
                        src={trip?.images[0]?.img_url}
                        alt="Room"
                        className="w-4/12 h-24 object-cover rounded"
                      />
                      <div className="flex flex-col justify-between py-2 space-y-2">
                        <span className="flex items-center font-semibold text-lg">
                          $ {trip.totalAmount}
                        </span>
                        <span className="flex items-center font-semibold text-xs">
                          No. of guests: {trip.noOfGuests}
                        </span>
                        <span className="flex items-center text-sm">
                          📅 {dayjs(trip.checkInDate).format('MMM D, YY')} to{' '}
                          {dayjs(trip.checkOutDate).format('MMM D, YY')}
                        </span>
                        <span
                          className={cx(
                            {
                              'text-red-600': !!trip.declineReason,
                              'text-green-600': !trip.declineReason,
                            },
                            'flex items-center gap-2 text-xs font-medium',
                          )}
                        >
                          {!trip.declineReason && <FaCheckCircle />}
                          {!!trip.declineReason && <FaStopCircle />}
                          {trip.declineReason ? 'Cancelled' : trip.bookingType}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deletePropertyMutation.mutate(trip.bookingId)
                      }
                    >
                      <FaTrash />
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
