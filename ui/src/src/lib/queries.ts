import {createQueryKeyStore} from '@lukemorales/query-key-factory';
import {stayeaseAxios} from './client';
import {
  GetPropertyResponse,
  GetReservationResponse,
  GetUserByTokenResponse,
} from './dto';

export const queryKeys = createQueryKeyStore({
  user: {
    get: (token?: string) => ({
      queryKey: [token],
      queryFn: () =>
        stayeaseAxios
          .get(`auth/me`)
          .then((res) => new GetUserByTokenResponse(res.data).payload),
    }),
  },
  property: {
    get: (propertyId?: string) => ({
      queryKey: [propertyId],
      queryFn: () =>
        stayeaseAxios
          .get(`property/${propertyId}`)
          .then((res) => new GetPropertyResponse(res.data).payload),
    }),
    list: () => ({
      queryKey: [''],
      queryFn: () =>
        stayeaseAxios
          .get(`property/all-properties`)
          .then((res) => res.data as GetPropertyResponse['payload'][]),
    }),
    my: () => ({
      queryKey: [''],
      queryFn: () =>
        stayeaseAxios
          .get(`property/my-properties`)
          .then((res) => res.data as GetPropertyResponse['payload'][]),
    }),
  },
  wishlist: {
    list: () => ({
      queryKey: [''],
      queryFn: () =>
        stayeaseAxios
          .get(`wishlist/my-properties`)
          .then((res) => res.data as GetPropertyResponse['payload'][]),
    }),
  },
  history: {
    upcomming: () => ({
      queryKey: [''],
      queryFn: () =>
        stayeaseAxios.get(`booking/upcoming`).then((res) => res.data),
    }),
  },
  reservations: {
    get: () => ({
      queryKey: [''],
      queryFn: () =>
        stayeaseAxios
          .get('property/all-reserved-properties')
          .then((res) => res.data as GetReservationResponse['payload'][]),
    }),
  },
});
