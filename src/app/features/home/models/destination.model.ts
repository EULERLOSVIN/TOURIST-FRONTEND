export interface DestinationModel{
    id: number;
    title: string;
    description: string;
    category: string;
    latitude: number;
    longitude: number;
    city: string;
    gallery: string[];
    schedule: string;
    recommendations: string;
    esFavorito: boolean;
    priceAdult: number;
    priceChild: number;
    reviews: ReviewModel[];
    entryTime: string;
    exitTime: string;
    statetoPublic: boolean;
    activities: ActivityModel[];
}

export interface ReviewModel{
    id: number;
    comment: string;
    rating: number;
}

export interface ActivityModel{
    id: number;
    description: string;
}