import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { Button } from '@src/src/components/ui/button';
import { Input } from '@src/src/components/ui/input';
import { Label } from '@src/src/components/ui/label';
import { stayeaseAxios } from '@src/src/lib/client';

const passwordSchema = z.object({
    newPassword: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const confirmPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("resetToken");
    const id = Number(searchParams.get("id"));

    const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const mutation = useMutation({
        mutationFn: async (data: { token: string | null; id: number | null; newPassword: string }) => {
            const res = await stayeaseAxios.post('/auth/newPassword', data);
            return res;
        },
        onSuccess: (res) => {
            console.log(res.data)
            if (res?.data?.success) {
                toast.success(res?.data?.message);
                navigate('/signin')
            } else {
                toast.error(res?.data?.message)
            }
        },
        onError: (error: any) => {
            console.log(error)
            console.log("An error occurred while setting a new password.", error?.response.data.message)
            toast.error(error?.response.data.message)
        },
    });

    const onSubmit: SubmitHandler<PasswordFormData> = (data) => {
        if (token && id) {
            mutation.mutate({ newPassword:data?.newPassword, token, id });
        } else {
            toast.error('Invalid reset link.');
        }
    };

    return (
        <div className="flex flex-col items-center">
      <h1 className="text-primary mb-4">Set New Password</h1>
      <form className="space-y-4 mx-auto max-w-md w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 mx-3">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            {...register('newPassword')}
            className={`mt-1 block w-full rounded-md ${errors.newPassword ? 'border-red-500' : ''}`}
          />
          {errors.newPassword && (
            <p className="text-red-500">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-2 mx-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            {...register('confirmPassword')}
            className={`mt-1 block w-full rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="flex justify-center items-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
    );
};

export default confirmPassword;
