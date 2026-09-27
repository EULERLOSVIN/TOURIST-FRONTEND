// Estructura de los comentarios enlazada al diagrama de tu Base de Datos
export interface TouristCommentDto {
    idComment: number;
    nameUser: string;
    qualification: number;
    commentText: string;
}

// Estructura de envío para registrar un nuevo comentario
export interface AddCommentRequestDto {
    idPlace: number;
    nameUser: string;
    qualification: number;
    comment: string;
}

// Captura los filtros de búsqueda y categorías desde la UI pública
export interface TouristPlaceFilterRequestDto {
    searchTerm?: string;
    idCategoryOfPlace?: number;
    pageNumber: number;
    pageSize: number;
}

// Modelo detallado que incluye la colección de comentarios
export interface TouristPlaceDetailsDto {
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
    galleryUrls: string[];
    recommendations: string[];
    activities: string[];
    comments: TouristCommentDto[]; // 🚀 Colección mapeada desde el backend
}