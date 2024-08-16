// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import 'react-toastify/dist/ReactToastify.css';
import {Label} from '@src/src/components/ui/label';
import {Input} from '@src/src/components/ui/input';
import {TextArea} from '@src/src/components/ui/textarea';
import {Button} from '@src/src/components/ui/button';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';

export const Step1 = (data: any) => {
  const {formData, handleFormDataChange, prevStep, nextStep} = data;
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm({defaultValues: formData});
  const formSchema = z.object({
    propertyName: z.string().min(1, 'Property Name is required'),
    description: z.string().min(1, 'Description is required'),
  });

  const onSubmitStep1 = (data) => {
    try {
      formSchema.pick({propertyName: true, description: true}).parse(data);
      console.log('DATAAA', data);
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
    <form onSubmit={handleSubmit(onSubmitStep1)}>
      <div className="space-y-4">
        <div className="space-y-2 mx-3">
          <Label htmlFor="name">property name</Label>
          <Input
            {...register('propertyName')}
            name="propertyName"
            placeholder="Property Name"
          />
          {errors.propertyName && (
            <p className="text-red-500">{errors.propertyName.message}</p>
          )}
        </div>

        <div className="space-y-2 mx-3">
          <Label htmlFor="description">Property Description</Label>
          <TextArea
            id="description"
            {...register('description')}
            placeholder="Enter Property Description"
            className="min-h-[120px] textarea"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full mt-3">
        Next
      </Button>
    </form>
  );
};
