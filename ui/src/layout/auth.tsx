import {Loading} from '@src/src/components/loading';
import {getToken} from '@src/src/lib/auth';
import {queryKeys} from '@src/src/lib/queries';
import {useUserStore} from '@src/store/user';
import {useQuery} from '@tanstack/react-query';
import {ReactNode, useEffect} from 'react';

export const AuthLayout = ({children}: {children: ReactNode}) => {
  const login = useUserStore((store) => store.login);

  const token = getToken() || '';

  const userQuery = useQuery({...queryKeys.user.get(token), enabled: !!token});

  useEffect(() => {
    if (userQuery.data?.user) {
      login(userQuery.data.user);
    }
  }, [userQuery.data, login]);

  if (userQuery.isFetching) {
    return <Loading />;
  }

  return children;
};
