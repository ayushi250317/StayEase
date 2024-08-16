import {useForm, SubmitHandler} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useMutation} from '@tanstack/react-query';
import {SigninRequest, SigninResponse} from '@src/src/lib/dto';
import {stayeaseAxios} from '@src/src/lib/client';
import {useUserStore} from '@src/store/user';
import {setToken} from '@src/src/lib/auth';

type signInSchemaType = {
  email: string;
  password: string;
};

const SignInPage = () => {
  const login = useUserStore((store) => store.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<signInSchemaType>();

  const signInMutation = useMutation({
    mutationFn: ({payload}: SigninRequest) =>
      stayeaseAxios
        .post('auth/authenticate', payload)
        .then((res) => new SigninResponse(res.data).payload),
  });

  const onSubmit: SubmitHandler<signInSchemaType> = async (data) => {
    try {
      const {email, password} = data;

      const response = await signInMutation.mutateAsync(
        new SigninRequest({email, password}),
      );

      if (
        response?.message === 'Please verify your account' ||
        response?.message === 'Incorrect Password' ||
        response?.message === 'Email not registered'
      ) {
        toast.error(response?.message);
      } else if (response.user && response.token) {
        //TODO: Store userDetails and token
        toast.success(response?.message);
        setToken(response.token);
        console.log(response.user);
        login(response.user);
        navigate('/');
      }
      console.log(response?.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('An error occurred while authenticating user!', error);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-md  py-2">
        <h1 className="text-center text-primary">Sign In</h1>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4 mx-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="me@example.com"
              required
              {...register('email')}
              className={`mt-1 block w-full rounded-md   ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className=" text-red-500  ">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2 mx-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              {...register('password')}
              className={`mt-1 block w-full rounded-md  bg-white  ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className=" text-red-500  ">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end mx-3 my-1">
            <Link to="/forgot-password" className="text-primary font-bold">
              Forgot Password?
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <div className="text-center font-semibold space-y-4">
          Do not have an account?{' '}
          <Link to="/signup" className="font-bold text-primary">
            SignUp
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
