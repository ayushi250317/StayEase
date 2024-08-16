import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {FaBuilding, FaUsers} from 'react-icons/fa';
import {Bar, BarChart, CartesianGrid, LabelList, XAxis} from 'recharts';
import {useEffect, useState} from 'react';
import {stayeaseAxios} from '@src/src/lib/client';
import {GetAdminDataResponse} from '@src/src/lib/dto';
import dayjs from 'dayjs';

function generateChartData(payload) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Initialize an array to hold user counts for each month
  const userCountsByMonth = new Array(12).fill(0);

  // Aggregate user counts by month
  payload.users?.forEach((user) => {
    const registrationDate = new Date(
      user.registrationTime[0],
      user.registrationTime[1] - 1,
      user.registrationTime[2],
    );
    const month = registrationDate.getMonth();
    userCountsByMonth[month]++;
  });

  // Generate the chart data
  const chartData = monthNames.map((month, index) => {
    return {month, users: userCountsByMonth[index]};
  });

  return chartData;
}

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export const AdminPage = () => {
  const [adminData, setAdminData] = useState<GetAdminDataResponse['payload']>({
    userCount: 0,
    propertyCount: 0,
    success: true,
    message: '',
    users: [],
    properties: [],
    bookings: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await stayeaseAxios.get('admin/adminData');
    console.log(res.data);
    setAdminData(res.data as GetAdminDataResponse['payload']);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center text-primary text-2xl md:text-3xl mt-6">
        📈 Analytics
      </h1>

      <section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <FaUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.userCount}</div>
              <p className="text-xs text-muted-foreground">
                +100 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <FaBuilding className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminData.propertyCount}
              </div>
              <p className="text-xs text-muted-foreground">
                +100 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="w-full sm:col-span-2">
            <CardHeader>
              <CardTitle>Recent Reservations</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {adminData.bookings?.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {booking.user.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      booked {booking.property?.name} for {booking.noOfGuests}{' '}
                      guests from {booking.checkInDate.join('-')} to{' '}
                      {booking.checkOutDate.join('-')}.
                    </p>
                  </div>
                  <div className="ml-auto font-medium">${booking.amount}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>List of users</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminData.users?.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user?.registrationTime
                          ? user.registrationTime.join('-')
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>User Registration by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={generateChartData(adminData)}
                  margin={{
                    top: 20,
                  }}
                  width={500}
                  height={300}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="users" fill="var(--color-desktop)" radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>List of properties</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Bookings until now</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price per night</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminData.properties?.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.createdBy}</TableCell>
                    <TableCell>
                      {dayjs(
                        property?.registrationTime.slice(0, 3).join('-'),
                      ).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell>{property.bookingsUntilNow}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>${property.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
