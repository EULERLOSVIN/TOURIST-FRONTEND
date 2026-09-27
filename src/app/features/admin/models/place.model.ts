import { Result } from '../../../shared/models/result.model';

export interface CategoryLookupDto {
    idCategory: number;
    categoryName: string;
}

export interface RegisterPlaceRequestDto {
    title: string;
    description: string;
    city: string;
    googleMapsLink: string;
    schedule: string;
    priceAdult: number;
    priceChild: number;
    stateToPublic: boolean;
    idCategory: number;
    gallery: string[]; // Aquí viajan las imágenes en Base64
    recommendations: string;
    activitiesNames: string[];
}

export interface UpdatePlaceRequestDto extends RegisterPlaceRequestDto {
    idPlace: number; // Reutiliza la estructura agregando el ID obligatorio
}

export interface PlaceFilterRequestDto {
    searchTerm?: string;
    idCategoryOfPlace?: number;
    destinationState?: string;
    pageNumber: number;
    pageSize: number;
}

export interface PlaceDetailsDto {
    idPlace: number;
    name: string;
    description: string;
    ubication: string;
    linkGoogleMaps: string;
    businessHours: string;
    costAdult: number;
    costChild: number;
    destinationState: string;
    idCategoryOfPlace: number;
    categoryName: string;
    galleryUrls: string[]; // URLs finales devueltas por ImgBB
    recommendations: string[];
    activities: string[];
}

export interface PagedResultDto<T> {
    items: T[];
    totalItems: number;
    pageNumber: number;
    totalPages: number;
}