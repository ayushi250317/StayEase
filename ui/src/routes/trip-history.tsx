import {Card, CardContent} from '@/components/ui/card';
import FeedbackModal from '@src/modals/FeedbackModal';
import {stayeaseAxios} from '@src/src/lib/client';
import {BookingHistoryResponse} from '@src/src/lib/dto';
import {cx} from 'class-variance-authority';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import {FaCheckCircle, FaHistory, FaStopCircle} from 'react-icons/fa';

export const TripHistoryPage = () => {
  const locations: Record<string, BookingHistoryResponse['payload'][] | []> =
    {};
  
  const [history, setHistory] = useState<BookingHistoryResponse['payload'][]>(
    [],
  );

  useEffect(() => {
    fetchHistory();
  }, []);


  const fetchHistory = async () => {
    const res = await stayeaseAxios.get('/booking/history');
    console.log(res.data);
    setHistory(res.data as BookingHistoryResponse['payload'][]);
    console.log('history', history);
  };

  for (const booking of history) {
    if (!locations[booking?.property?.address]) {
      locations[booking?.property?.address] = [];
    }
    locations[booking?.property?.address] = [booking];
  }
  console.log(locations);
  const locationEntries = Object.entries(locations);
  // const data = locationEntries.map(([locaiton, value]) => {
  //   value.map((trip) => {
  //     console.log(trip.property.propertyId)
  //     set
  //   })
  // })
  console.log('locationentries', Object.values(locationEntries));
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-center text-primary flex flex-col sm:flex-row w-fit gap-2 sm:gap-5 mx-auto items-center text-2xl sm:text-3xl md:text-4xl mb-8">
        <FaHistory className="text-3xl sm:text-4xl" />
        Your previous bookings
      </h1>
      <section className="mt-8 space-y-8">
        {locationEntries.map(([location, value]) => (
          <div key={location} className="mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              📍 {location}
            </h3>
            <div className="flex flex-wrap gap-4">
              {value.map((trip: any) => (
                <Card
                  key={trip.property.propertyId}
                  className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)] xl:w-[calc(25%-12px)]"
                >
                  <CardContent className="p-4">
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
                          {' - '}
                          {trip.declineReason}
                        </span>
                      </div>
                    </div>
                      <FeedbackModal propertyId={trip.property.propertyId} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
