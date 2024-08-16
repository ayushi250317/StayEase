import {GetPropertyResponse} from '@src/src/lib/dto';

export type Filter = {
  name?: string;
  type?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  bed?: number;
};

export enum SortBy {
  PRICE_HIGH_TO_LOW = 'Price High to Low',
  PRICE_LOW_TO_HIGH = 'Price Low to High',
}

export const filterAndSortProperties = (
  properties: Array<GetPropertyResponse['payload']>,
  filter: Filter,
  sortBy: SortBy | null | undefined,
): Array<GetPropertyResponse['payload']> => {
  let filteredProperties = properties;

  // Filter by name (fuzzy search)
  if (filter.name && filter.name.trim() !== '') {
    const nameLower = filter.name.toLowerCase();
    filteredProperties = filteredProperties.filter((property) =>
      property.name.toLowerCase().includes(nameLower),
    );
  }

  // Filter by type
  if (filter.type && filter.type.length > 0) {
    filteredProperties = filteredProperties.filter((property) =>
      filter.type?.includes(property.propertyType),
    );
  }

  // Filter by price
  if (filter.price) {
    if (filter.price.min !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.price >= (filter?.price?.min || 0),
      );
    }
    if (filter.price.max !== undefined) {
      filteredProperties = filteredProperties.filter(
        (property) => property.price <= (filter?.price?.max || 0),
      );
    }
  }

  // Filter by amenities
  if (filter.amenities && filter.amenities.length > 0) {
    filteredProperties = filteredProperties.filter((property) =>
      filter.amenities?.every((amenity) =>
        property.amenities.includes(amenity),
      ),
    );
  }

  // Apply sorting
  if (sortBy) {
    filteredProperties = filteredProperties.sort((a, b) => {
      if (sortBy === SortBy.PRICE_LOW_TO_HIGH) {
        return a.price - b.price;
      } else if (sortBy === SortBy.PRICE_HIGH_TO_LOW) {
        return b.price - a.price;
      }
      return 0;
    });
  }
  // Filter by number of beds
  if (filter.bed !== undefined) {
    filteredProperties = filteredProperties.filter(
      (property) => property.noOfBeds >= (filter?.bed || 0),
    );
  }

  return filteredProperties;
};
