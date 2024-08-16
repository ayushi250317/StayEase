import {z} from 'zod';
import {useForm, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'react-toastify';
import validator from 'validator';
import {Link} from 'react-router-dom';
import PhoneInput, {CountryData} from 'react-phone-input-2';

import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';

import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useMutation} from '@tanstack/react-query';
import {stayeaseAxios} from '@src/src/lib/client';
import {SigninResponse, SignupRequest} from '@src/src/lib/dto';
import {useUserStore} from '@src/store/user';
import {setToken} from '@src/src/lib/auth';

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, {message: 'Firstname must be at least 1 character'}),
    lastName: z
      .string()
      .min(1, {message: 'Lastname must be at least 1 character'}),
    email: z.string().email('Invalid email format'),
    dateOfBirth: z.string(),
    phoneNumber: z
      .string()
      .refine(validator.isMobilePhone, {message: 'Invalid phone format'}),
    password: z
      .string()
      .min(8, {message: 'Password must be at least 8 characters long'})
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type signUpSchemaType = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const login = useUserStore((store) => store.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const handlePhoneChange = (
    value: string,
    data: CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string,
  ) => {
    console.log(formattedValue);
    setValue('phoneNumber', formattedValue);
  };

  const signupMutation = useMutation({
    mutationFn: ({payload}: SignupRequest) =>
      stayeaseAxios
        .post(`auth/register`, payload)
        .then((res) => new SigninResponse(res.data).payload),
  });

  const onSubmit: SubmitHandler<signUpSchemaType> = async (data) => {
    try {
      const {firstName, lastName, email, dateOfBirth, password, phoneNumber} =
        data;
      const fullName = firstName + ' ' + lastName;
      const DOB = new Date(dateOfBirth);
      const res = await signupMutation.mutateAsync(
        new SignupRequest({
          fullName,
          dateOfBirth: DOB,
          email,
          password,
          phoneNumber,
          address: '',
        }),
      );
      if (res?.message === 'Registration Successful') {
        toast.success('Please verify your email.');
      } else if (res?.message === 'Email already registered') {
        toast.error(res?.message);
      } else if (res.user?.payload) {
        setToken(res.token || '');
        login({
          ...res.user?.payload,
        });
      }
      // toast.success(`Welcome to StayEase ${fullName}!`);
      // navigate('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(
        'An error occurred while registering the user.',
        error.message,
      );
    }
  };

  return (
    <>
      <div className="mx-auto max-w-md space-y-6 py-2">
        <h1 className="text-center text-primary">Sign Up</h1>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 mx-3">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                placeholder="Walter"
                required
                className={`mt-1 block w-full rounded-md ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className=" text-red-500 ">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                id="last-name"
                placeholder="White"
                required
                {...register('lastName')}
                className={`mt-1 block w-full rounded-md   ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors.lastName && (
                <p className=" text-red-500  ">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2 mx-3">
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
              <p className=" text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2 mx-3">
            <Label htmlFor="date-of-birth">Date of Birth</Label>
            <Input
              id="date-of-birth"
              type="date"
              required
              max={new Date().toISOString().substr(0, 10)}
              {...register('dateOfBirth')}
              className={`mt-1 block w-full rounded-md   ${
                errors.dateOfBirth ? 'border-red-500' : ''
              }`}
            />
            {errors.dateOfBirth && (
              <p className=" text-red-500  ">{errors.dateOfBirth.message}</p>
            )}
          </div>
          <div className="space-y-2 mx-3">
            <Label htmlFor="phone-number">Phone Number</Label>
            <PhoneInput
              inputProps={{
                name: 'phoneNumber',
                required: true,
                autoFocus: true,
              }}
              country={'us'}
              inputStyle={{
                marginTop: '4px',
                display: 'block',
                width: '100%',
                borderColor: `${errors.phoneNumber ? '#ef4444' : ''}`,
              }}
              onChange={handlePhoneChange}
            />
            {errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="space-y-2 mx-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              {...register('password')}
              className={`mt-1 block w-full rounded-md   ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className=" text-red-500  ">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2 mx-3">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              {...register('confirmPassword')}
              className={`mt-1 block w-full rounded-md   ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
            />
            {errors.confirmPassword && (
              <p className=" text-red-500  ">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex justify-center items-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <div className="text-center font-semibold">
          Already have an account?
          <Link to="/signin" className="text-primary font-bold">
            {' '}
            SignIn
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
