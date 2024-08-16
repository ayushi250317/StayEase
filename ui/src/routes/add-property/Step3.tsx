/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import 'react-toastify/dist/ReactToastify.css';
import {Label} from '@src/src/components/ui/label';
import {Input} from '@src/src/components/ui/input';
import {TextArea} from '@src/src/components/ui/textarea';
import {Button} from '@src/src/components/ui/button';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {usePlacesWidget} from 'react-google-autocomplete';

export const Step3 = (data: any) => {
  const {formData, handleFormDataChange, prevStep, nextStep} = data;

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    trigger,
    setError,
    watch,
  } = useForm({
    defaultValues: formData,
  });

  const location = watch('location');

  const {ref} = usePlacesWidget({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      const lat = place.geometry?.location.lat();
      const lng = place.geometry?.location?.lng();

      setValue('location', place.formatted_address);
      setValue('lat', lat);
      setValue('lng', lng);
      trigger('location');
    },
  });

  const formSchema = z.object({
    price: z
      .string()
      .min(1, 'Property Price is required')
      .max(1000000, 'Price must not exceed 1,000,000'),
    location: z.string().min(1, 'Property Location is required'),
    address: z.string().min(1, 'Property Address is required'),
  });

  const onSubmitStep3 = (data: any) => {
    try {
      formSchema
        .pick({
          price: true,
          location: true,
          address: true,
          lat: true,
          lng: true,
        })
        .parse(data);
      handleFormDataChange(data);
      nextStep();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          setError(err.path[0], {type: 'manual', message: err.message});
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitStep3)}>
      <div className="space-y-4">
        <div className="space-y-2 mx-3">
          <Label htmlFor="name">property Price</Label>
          <Input
            {...register('price')}
            name="price"
            placeholder="Property Price"
            type="number"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2 mx-3">
          <Label htmlFor="name">property Location</Label>
          <Input
            {...register('location')}
            value={location}
            name="location"
            placeholder="Property Location"
            type="text"
            ref={ref}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2 mx-3">
          <Label htmlFor="description">Complete Address</Label>
          <TextArea
            {...register('address')}
            id="address"
            placeholder="Enter Property Address"
            className="min-h-[120px] textarea"
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};
