/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Label} from '@src/src/components/ui/label';
import {Button} from '@src/src/components/ui/button';
import {FiHome, FiShield} from 'react-icons/fi';
import {MdApartment} from 'react-icons/md';
import {Propertytype} from '@src/src/lib/dto';
import {MultiSelect} from '@src/src/components/ui/multi-select';
import {amenities as staticAmenities} from '@/lib/data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Step2 = (data: any) => {
  const {formData, handleFormDataChange, prevStep, nextStep} = data;

  const [isOpen, setIsOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(formData.guests);
  const [bathroomCount, setBathroomCount] = useState(formData.bathrooms);
  const [roomCount, setRoomCount] = useState(formData.rooms);
  const propertyTypes = [
    {label: 'House', icon: <FiHome />, value: Propertytype.HOUSE},
    {label: 'Apartment', icon: <MdApartment />, value: Propertytype.APARTMENT},
    {label: 'Villa', icon: <FiShield />, value: Propertytype.VILLA},
  ];
  const [selectedValue, setSelectedValue] = useState({
    label: propertyTypes[0].value,
    icon: propertyTypes[0].icon,
  });

  const handleSelect = (value: any, icon: any) => {
    setSelectedValue({label: value, icon});
    setIsOpen(false);
  };

  const [amenities, setAmenities] = useState<string[]>([]);

  const handleSubmit = () => {
    handleFormDataChange({
      propertyType: selectedValue.label,
      guests: guestCount,
      bathrooms: bathroomCount,
      rooms: roomCount,
      amenities,
    });
    nextStep();
  };
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2 mx-3">
          <Label htmlFor="name">Select Property Type</Label>
          <div className="relative w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full mx-auto block text-left py-2 px-4 rounded-md border border-gray-300 flex items-center"
            >
              {selectedValue.icon && (
                <span className="mr-2">{selectedValue.icon}</span>
              )}
              {selectedValue.label}
            </button>
            {isOpen && (
              <div className="absolute w-full border border-gray-300 shadow-lg bg-white mt-2 rounded-md">
                {propertyTypes.map((item) => (
                  <div
                    key={item.label}
                    className="p-2 border-b border-gray-300 cursor-pointer flex items-center"
                    onClick={() => handleSelect(item.value, item.icon)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 mx-3">
          <Label htmlFor="name">Amenities</Label>
          <MultiSelect
            options={staticAmenities.map((s) => ({
              label: s.label,
              value: s.key,
              icon: s.icon,
            }))}
            defaultValue={[]}
            onValueChange={setAmenities}
          />
        </div>

        <div className="space-y-2 mx-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <Label htmlFor="guests">Guests</Label>
            <div className="p-5 flex gap-5 items-center">
              <Button
                onClick={() => {
                  if (guestCount > 0) {
                    const newGuestCount = guestCount - 1;
                    setGuestCount(newGuestCount);
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                -
              </Button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">
                {guestCount}
              </span>

              <Button
                onClick={() => {
                  const newGuestCount = guestCount + 1;
                  setGuestCount(newGuestCount);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 mx-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <div className="p-5 flex gap-5 items-center">
              <Button
                onClick={() => {
                  if (bathroomCount > 0) {
                    const newBathrromCount = bathroomCount - 1;
                    setBathroomCount(newBathrromCount);
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                -
              </Button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">
                {bathroomCount}
              </span>

              <Button
                onClick={() => {
                  const newBathrromCount = bathroomCount + 1;
                  setBathroomCount(newBathrromCount);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 mx-3">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <Label htmlFor="rooms">Rooms</Label>
            <div className="p-5 flex gap-5 items-center">
              <Button
                onClick={() => {
                  if (roomCount > 0) {
                    setRoomCount(roomCount - 1);
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                -
              </Button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md">
                {roomCount}
              </span>

              <Button
                onClick={() => {
                  const newRoomCount = roomCount + 1;
                  setRoomCount(newRoomCount);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                +
              </Button>
            </div>
          </div>
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

        <Button type="submit" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </>
  );
};
