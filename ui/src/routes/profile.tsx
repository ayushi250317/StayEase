import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {TextArea} from '@/components/ui/textarea';
import {useUserStore} from '@src/store/user';
import {useForm} from 'react-hook-form';
import {UpdateUserRequest, User} from '@src/src/lib/dto';
import {useMutation} from '@tanstack/react-query';
import {queryClient, stayeaseAxios} from '@src/src/lib/client';
import {toast} from 'react-toastify';
import {useEffect} from 'react';

export const ProfilePage = () => {
  const {user} = useUserStore();

  if (!user) {
    return <>Unauthenticated!</>;
  }

  return <Profile />;
};

const Profile = () => {
  const {user} = useUserStore();

  const form = useForm<User['payload']>({
    defaultValues: user,
  });

  useEffect(() => {
    form.reset(user);
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: ({payload}: UpdateUserRequest) =>
      stayeaseAxios.put(`auth/me`, payload),
    onSuccess: () => {
      toast.success(`User updated successfully`);
      queryClient.refetchQueries();
    },
    onError: (error: any) => {
      console.log(error.response.data )
      toast.error(error.response.data.address || "Error updating profile details")
    }
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (files: FileList) => {
      const formData = new FormData();

      formData.append('file', files[0]);

      return stayeaseAxios.put(`auth/me/update-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast.success(`User profile picture updated successfully`);
      queryClient.refetchQueries();
    },
  });

  const onSubmit = form.handleSubmit((payload) =>
    updateUserMutation.mutate(
      new UpdateUserRequest({
        address: payload.address,
        dateOfBirth: payload.dateOfBirth,
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
      }),
    ),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Your profile</h2>

      <section className="mt-8 flex flex-wrap gap-10">
        <img
          className="w-1/12"
          src={
            user?.userAvatar ||
            'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
          }
        />
        <div className="w-full">
          <Input
            type="file"
            accept="image/jpg, image/jpeg"
            onChange={(e) =>
              updateAvatarMutation.mutate(e.target.files || ({} as FileList))
            }
          />
        </div>
        <div className="space-y-2 w-3/12">
          <label>Full name: </label>
          <Input placeholder="John Doe" {...form.register('fullName')} />
        </div>

        <div className="space-y-2 w-3/12">
          <label>Email: </label>
          <Input
            placeholder="john@doe.com"
            disabled
            {...form.register('email')}
            type="email"
          />
        </div>

        <div className="space-y-2 w-3/12">
          <label>Contact: </label>
          <Input
            placeholder="+19999999999"
            {...form.register('phoneNumber')}
          />
        </div>

        <div className="space-y-2 w-full">
          <label>Address: </label>
          <TextArea placeholder="Address" {...form.register('address')} />
        </div>

        {/* <div className="space-y-2 w-6/12">
          <label>New Password: </label>
          <Input placeholder="new password" type="password" />
        </div>

        <div className="space-y-2 w-5/12">
          <label>Confirm New Password: </label>
          <Input placeholder="confirm new password" type="password" />
        </div> */}

        <Button onClick={onSubmit} disabled={updateUserMutation.isPending}>
          Update
        </Button>
      </section>
    </div>
  );
};
