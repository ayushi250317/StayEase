import {AdvancedMarker, Map} from '@vis.gl/react-google-maps';
import {useRef, useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent} from '@/components/ui/card';
import {cx} from 'class-variance-authority';
import {Button} from '@/components/ui/button';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {queryKeys} from '@src/src/lib/queries';

export const PropertiesByLocation = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [position, setPosition] = useState<google.maps.LatLngLiteral>();
  const [selectedRoom, setSelectedRoom] = useState('');
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => alert(err?.message),
    );
  }, []);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener('place_changed', () => {
      const latLongHelper = placeAutocomplete.getPlace().geometry?.location;
      const lat = latLongHelper?.lat();
      const lng = latLongHelper?.lng();
      if (lat && lng) {
        setPosition({lat, lng});
      }
    });
  }, [placeAutocomplete]);

  const propertiesQuery = useQuery(queryKeys.property.list());
  useEffect(() => {
    if (search.get('location') && inputRef.current) {
      inputRef.current.value = search.get('location') || '';

      inputRef.current.focus();
      const event = new Event('input', {bubbles: true});
      inputRef.current.dispatchEvent(event);
    }
  }, [search, places]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-5 mt-10">
        <div className="w-full lg:w-1/2 xl:w-5/12 lg:overflow-y-scroll lg:h-screen">
          <Input
            ref={inputRef}
            className="mb-4"
            defaultValue={search.get('location') || ''}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {propertiesQuery.data?.map((d) => (
              <Card
                key={d.id}
                className={cx('cursor-pointer', {
                  'border-primary': selectedRoom === d.id,
                })}
                onClick={() => {
                  setSelectedRoom(d.id);
                  setPosition({lat: d.lat, lng: d.lng});
                }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={d.images[0]?.img_url}
                      className="w-full sm:w-5/12 h-40 object-cover rounded-md"
                      alt={d.name}
                    />
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-semibold">{d.name}</h4>
                      <span className="font-light block">${d.price}/Night</span>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/property/${d.id}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 xl:w-7/12 h-[400px] lg:h-screen">
          {!position?.lat && !position?.lng ? (
            <div className="flex items-center justify-center h-full">
              Loading...
            </div>
          ) : (
            <Map
              center={position}
              onCenterChanged={(event) => setPosition(event.detail.center)}
              defaultZoom={13}
              className="w-full h-full"
              mapId="4504f8b37365c3d0"
            >
              {propertiesQuery.data?.map((d) => (
                <AdvancedMarker
                  key={d.id}
                  position={{lat: d.lat, lng: d.lng}}
                  clickable
                >
                  <Badge
                    className={cx('text-sm', {
                      'text-lg': d.id === selectedRoom,
                    })}
                  >
                    {d.price}$
                  </Badge>
                </AdvancedMarker>
              ))}
            </Map>
          )}
        </div>
      </div>
    </div>
  );
};
