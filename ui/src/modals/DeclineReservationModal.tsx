import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseMutateFunction, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { declineReservationData } from '@src/routes/manage-reservation-page';

const declineReservationSchema = z.object({
    reason: z
        .string()
        .min(3, { message: 'reason must have at least 3 characters' }),
});

type declineReservationSchemaType = z.infer<typeof declineReservationSchema>;

type declineReservationModalProps = {
    bookingId: number,
    declineMutation: UseMutationResult<AxiosResponse<any, any>, Error, declineReservationData, unknown>
}

const DeclineReservationModal = ({bookingId,declineMutation}:declineReservationModalProps) => {

    const [loading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<declineReservationSchemaType>({
        resolver: zodResolver(declineReservationSchema)
    });

    const onSubmit: SubmitHandler<declineReservationSchemaType> = async (data) => {
        setIsLoading(true);
        declineMutation.mutate({ bookingId, reason: data?.reason });
        setIsLoading(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <FaTrash className="mr-4" />
                    Decline Reservation
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] md:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Reason</DialogTitle>
                    <DialogDescription>
                        Please provide your reason for cancellation of reservation
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="feedbackText" className="text-left pl-3">
                            Reason
                        </Label>
                        <Input
                            id="feedback"
                            type="text"
                            {...register('reason')}
                            className="col-span-3"
                        />
                        {errors.reason && (
                            <span className="text-red-500 text-xs col-span-4">
                                {errors.reason.message}
                            </span>
                        )}
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeclineReservationModal;
