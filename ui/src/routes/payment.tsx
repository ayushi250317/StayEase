import {Button} from '@/components/ui/button';
import {intervalToDuration} from 'date-fns';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import dayjs from 'dayjs';
import {FaBed, FaCalendar, FaDollarSign} from 'react-icons/fa';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {stayeaseAxios} from '@src/src/lib/client';
import {PropertyBookRequest} from '@src/src/lib/dto';
import { loadStripe } from "@stripe/stripe-js";

function calculateAmountWithTax(amount: number) {
  const taxRate = 0.15;
  const taxAmount = amount * taxRate;
  const totalAmount = amount + taxAmount;
  return totalAmount;
}

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const bookingDetails = {
    checkIn: search.get('checkIn'),
    checkOut: search.get('checkOut'),
    roomType: search.get('type'),
    guests: +(search.get('guests') || 0),
    price: +(search.get('total') || 0),
    id: +(search.get('id') || 0),
    taxes: calculateAmountWithTax(+(search.get('total') || 0)),
  };


const redirectToStripe = useMutation({
  mutationFn: ({payload}: PropertyBookRequest) =>
    stayeaseAxios.post(`booking/create-payment-intent`, payload),
  onSuccess: async (res) => {
    const PUBLIC_KEY = "";
    const stripeTestPromise = await loadStripe(PUBLIC_KEY);

    if(stripeTestPromise){
      const result:any = await stripeTestPromise.redirectToCheckout({
        sessionId: res.data.sessionId,
      });
      if(result.err) {
        console.log("Error redirectinggg", result.err);
      } else {
        console.log("Hereee?");
      }
    }
  },
});

const handlePayment = () => {
  redirectToStripe.mutate(
    new PropertyBookRequest({
      checkInDate: bookingDetails.checkIn || "",
      checkOutDate: bookingDetails.checkOut || "",
      noOfChildren: bookingDetails.guests,
      noOfGuests: bookingDetails.guests,
      tax: 15,
      totalAmount: bookingDetails.taxes,
      amount: bookingDetails.price,
      property_id: bookingDetails.id
    }),
  )
}

  const diff = intervalToDuration({
    start: bookingDetails.checkIn || '',
    end: bookingDetails.checkOut || '',
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-primary flex flex-col sm:flex-row w-fit gap-2 sm:gap-5 mx-auto items-center text-2xl sm:text-3xl md:text-4xl mb-8">
        Checkout
      </h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your booking details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="font-bold">Check-in</Label>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-500" />
                <span>
                  {dayjs(bookingDetails.checkIn).format('ddd, MMM D, YYYY')}
                </span>
              </div>
              <span className="text-sm text-gray-500">From 10:00</span>
            </div>
            <div>
              <Label className="font-bold">Check-out</Label>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-500" />
                <span>
                  {dayjs(bookingDetails.checkOut).format('ddd, MMM D, YYYY')}
                </span>
              </div>
              <span className="text-sm text-gray-500">Until 13:00</span>
            </div>
          </div>

          <div className="mb-6">
            <Label className="font-bold">Total length of stay:</Label>
            <span className="ml-2">{diff.days} nights</span>
          </div>

          <div className="mb-6">
            <Label className="font-bold">You selected</Label>
            <div className="flex items-center gap-2">
              <FaBed className="text-gray-500" />
              <span>{bookingDetails.roomType}</span>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => navigate(`/property/${search.get('id')}`)}
            >
              Change your selection
            </Button>
          </div>

          <Separator className="my-6" />

          <div>
            <CardTitle className="mb-4">Your price summary</CardTitle>
            <div className="bg-secondary p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Price</span>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg">
                    CAD {bookingDetails.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    +CAD {bookingDetails.taxes} taxes and charges
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label className="font-bold">Price information</Label>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaDollarSign />
                <span>
                  Excludes CAD {bookingDetails.taxes} in taxes and other charges
                </span>
              </div>
              <div className="ml-6 text-sm">
                <div>
                  15 % Tax
                  <span className="float-right">
                    CAD {bookingDetails.taxes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6" onClick={handlePayment}>Proceed to Payment</Button>
        </CardContent>
      </Card>
    </div>
  );
};
