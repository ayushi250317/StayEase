import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
import { useMutation } from '@tanstack/react-query';
import { stayeaseAxios } from '@src/src/lib/client';

const feedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .gte(1, { message: 'Rating must be at least 1' })
    .lte(5, { message: 'Rating must be at most 5' }),
  feedback: z
    .string()
    .min(3, { message: 'Feedback must have at least 3 characters' }),
});

type feedbackSchemaType = z.infer<typeof feedbackSchema>;

type createFeedbackSchema = {
  propertyId: number,
  rating: string,
  content: string
}

type feedbackModalProps = {
  propertyId: number
}

const FeedbackModal = ({propertyId}:feedbackModalProps) => {

  const [loading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  console.log({propertyId})

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<feedbackSchemaType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: (data: createFeedbackSchema) => stayeaseAxios.post("/review/new", data),
    onSuccess: (res) => {
      console.log(res)
      toast.success(res.data.message)
      setIsOpen(false);
      setIsLoading(false);
    },
    onError: (error:any) => {
      console.log(error)
      toast.error(error.response.data.message)
      setIsLoading(false)
    }
  })

  const onSubmit: SubmitHandler<feedbackSchemaType> = async (data) => {
    const { rating, feedback } = data;
    setIsLoading(true);
    createFeedbackMutation.mutate({ rating: rating.toString(), content: feedback, propertyId })
  };

  const handleStarClick = (index: number) => {
    setRating(index);
    setValue('rating', index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Feedback</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[340px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Feedback</DialogTitle>
          <DialogDescription>
            Please provide your feedback below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-left pl-3">
              Rating
            </Label>
            <div className="col-span-3 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`cursor-pointer mx-auto w-8 h-8 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            {errors.rating && (
              <span className="text-red-500 text-xs col-span-4">
                {errors.rating.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="feedbackText" className="text-left pl-3">
              Feedback
            </Label>
            <Input
              id="feedback"
              type="text"
              {...register('feedback')}
              className="col-span-3"
            />
            {errors.feedback && (
              <span className="text-red-500 text-xs col-span-4">
                {errors.feedback.message}
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

export default FeedbackModal;
