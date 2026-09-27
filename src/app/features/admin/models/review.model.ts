// Filtros enviados desde la vista de moderación
export interface CommentFilterRequestDto {
    searchTerm?: string;
    state?: string; // 'Pendiente' (1) o 'Aprobado' (2)
    pageNumber: number;
    pageSize: number;
}

// Estructura de la tarjeta de reseña para la grilla de moderación
export interface CommentModerationDto {
    idComment: number;
    nameUser: string;
    qualification: number;
    commentText: string;
    creationDate: string; // ISO String desde el servidor
    idPlace: number;
    placeName: string;
    idCommentState: number;
    stateName: string;
}