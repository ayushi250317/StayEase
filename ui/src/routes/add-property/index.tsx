// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import {Step3} from './Step3';
import {Step4} from './Step4';
import {Step2} from './Step2';
import {Step1} from './Step1';
import {useMutation} from '@tanstack/react-query';
import {stayeaseAxios} from '@src/src/lib/client';
import {AddPropertyResponse, PropertyAddRequest} from '@src/src/lib/dto';

export const AddProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    propertyName: '',
    description: '',
    propertyType: '',
    price: 0,
    guests: 1,
    bathrooms: 1,
    rooms: 1,
    location: '',
    address: '',
    photos: [],
    lat: 0,
    lng: 0,
    amenities: [],
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const _formData = new FormData();

      for (const photo of formData?.photos || []) {
        _formData.append('files', photo);
      }

      return stayeaseAxios.put(`property/add-images/${propertyId}`, _formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });

  const addPropertyMutation = useMutation({
    mutationFn: async ({payload}: PropertyAddRequest) =>
      stayeaseAxios
        .post(`property/add`, payload)
        .then((res) => new AddPropertyResponse(res.data).payload),
    onSuccess(data) {
      uploadImagesMutation.mutate(data.property_id);
    },
  });

  useEffect(() => {
    console.log('FOR DATA UPDATEDDD', formData);
  }, [formData]);

  const handleFormDataChange = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    console.log({formData});
    console.log(
      'FORM SUBMISSION',
      formData.photos,
      JSON.stringify(formData.photos[0]),
    );
    toast.success('SUCCESS FORM');

    addPropertyMutation.mutate(
      new PropertyAddRequest({
        name: formData.propertyName,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        propertyType: formData.propertyType,
        guestAllowed: formData.guests,
        lat: formData.lat,
        lng: formData.lng,
        noOfBaths: formData.bathrooms,
        noOfBeds: formData.rooms,
        price: formData.price,
        amenities: formData.amenities,
      }),
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:w-10/12 xl:w-8/12 mx-auto">
      <h1 className="text-center text-primary">Add Property</h1>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-3">
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};
