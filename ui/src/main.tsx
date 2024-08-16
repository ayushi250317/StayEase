import {HomePage} from '@src/routes';
import {APIProvider} from '@vis.gl/react-google-maps';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import './index.css';
import {LandingLayout} from './layout/landings';
import {AddProperty} from './routes/add-property';
import {AdminPage} from './routes/admin-page';
import {BookedProperty} from './routes/booked-property';
import {ContactPage} from './routes/contact';
import {FAQPage} from './routes/faq';
import {ManageReservationPage} from './routes/manage-reservation-page';
import {PaymentPage} from './routes/payment';
import {ProfilePage} from './routes/profile';
import {PropertiesByLocation} from './routes/properties/properties-by-location-page';
import {StayPlacesProperties} from './routes/properties/properties-page';
import {Property} from './routes/property';
import SignInPage from './routes/signin';
import SignUpPage from './routes/signup';
import {TripHistoryPage} from './routes/trip-history';
import {Wishlist} from './routes/wishlist';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './src/lib/client';
import {AuthLayout} from './layout/auth';
import {ManagePropertyPage} from './routes/manage-property';
import confirmRegistration from './routes/confirm-registration';
import forgotPassword from './routes/forgot-password';
import confirmPassword from './routes/confirm-password';
import {ManageTripsPage} from './routes/manage-trips';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthLayout>
        <LandingLayout />
      </AuthLayout>
    ),
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/faq',
        Component: FAQPage,
      },
      {
        path: '/contact',
        Component: ContactPage,
      },
      {
        path: '/signin',
        Component: SignInPage,
      },
      {
        path: '/signup',
        Component: SignUpPage,
      },
      {
        path: '/add-property',
        Component: AddProperty,
      },
      {
        path: '/properties',
        Component: StayPlacesProperties,
      },
      {
        path: '/properties-by-location',
        element: (
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <PropertiesByLocation />
          </APIProvider>
        ),
      },
      {
        path: '/property/:propertyId',
        Component: Property,
      },
      {
        path: '/history/:propertyId',
        Component: BookedProperty,
      },
      {
        path: '/wishlist',
        Component: Wishlist,
      },
      {
        path: '/admin',
        Component: AdminPage,
      },
      {
        path: '/profile',
        Component: ProfilePage,
      },
      {
        path: '/reservations',
        Component: ManageReservationPage,
      },
      {
        path: '/trips',
        Component: TripHistoryPage,
      },
      {
        path: '/manage-trips',
        Component: ManageTripsPage,
      },
      {
        path: '/checkout',
        Component: PaymentPage,
      },
      {
        path: '/manage',
        Component: ManagePropertyPage,
      },
      {
        path: '/confirm_registration',
        Component: confirmRegistration,
      },
      {
        path: '/forgot-password',
        Component: forgotPassword,
      },
      {
        path: '/confirm_password',
        Component: confirmPassword,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <ToastContainer />
      <RouterProvider router={router} />
    </React.StrictMode>
  </QueryClientProvider>,
);
