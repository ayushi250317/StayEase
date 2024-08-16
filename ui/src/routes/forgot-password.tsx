import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import 'react-toastify/dist/ReactToastify.css';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { stayeaseAxios } from '@src/src/lib/client';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const forgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: async (email: string) => {
            const res = await stayeaseAxios.post('auth/forgotPassword', { email });
            return res;
        },
        onSuccess: (res) => {
            console.log(res)
            if (res?.data?.success) {
                toast.success(res?.data?.message)
            } else {
                toast.error(res?.data?.message)
            }
        },
        onError: (error: any) => {
            console.log("An error occurred while sending a forgot password email.", error?.response.data.message)
            toast.error(error?.response.data.message)
        }
    });

    const onSubmit: SubmitHandler<ForgotPasswordSchemaType> = async (data) => {
        forgotPasswordMutation.mutate(data.email);
    };

    return (
        <>
            <div className="mx-auto max-w-md space-y-6 py-2">
                <h1 className="text-center text-primary">Forgot Password</h1>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2 mx-3">
                        <Label htmlFor="email">Enter your email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            {...register('email')}
                            className={`mt-1 block w-full rounded-md ${errors.email ? 'border-red-500' : ''
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="flex justify-center items-center">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default forgotPassword;
