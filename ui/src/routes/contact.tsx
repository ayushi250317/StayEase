// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Label} from '@src/src/components/ui/label';
import {Input} from '@src/src/components/ui/input';
import {TextArea} from '@src/src/components/ui/textarea';
import {Button} from '@src/src/components/ui/button';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {FaMapMarkerAlt, FaPhoneAlt} from 'react-icons/fa';
import {MdEmail} from 'react-icons/md';

export const ContactPage = () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = () => {
    toast.success('Form submitted successfully');
  };

  return (
    <div className="w-8/12 mx-auto">
      <h1 className="text-center text-primary">Contact us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 container mx-auto py-12 px-4 md:px-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-2xl text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Address</h3>
                  <p className="text-muted-foreground">
                    123 Main Street, Anytown USA 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaPhoneAlt className="text-2xl text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-muted-foreground">(123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MdEmail className="text-2xl text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-muted-foreground">info@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register('name')}
                  id="name"
                  placeholder="Enter your name"
                  className="input"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className="input"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <TextArea
                {...register('message')}
                id="message"
                placeholder="Enter your message"
                className="min-h-[120px] textarea"
              />
              {errors.message && (
                <p className="text-red-500">{errors.message.message}</p>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
