// DTO para obtener la configuración guardada desde el backend
export interface SystemConfigDto {
    idSystemConfig: number;
    titleMain: string;
    subtitle: string;
    urlImageMain: string;
    urlLoginImage: string;
}

// DTO para guardar / actualizar la Tarjeta 1 (Portada Principal)
export interface SaveHeroConfigDto {
    titleMain: string;
    subtitle: string;
    imageMainBase64OrUrl?: string; // Cadena Base64 o URL HTTPS previa
}

// DTO para guardar / actualizar la Tarjeta 2 (Fondo de Login)
export interface SaveLoginBgConfigDto {
    imageLoginBase64OrUrl: string; // Cadena Base64 o URL HTTPS previa
}