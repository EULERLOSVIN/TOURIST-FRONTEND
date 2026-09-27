// DTOs para el flujo de acceso (Login)
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  isSuccess: boolean;
  message: string;
  token: string;
  name: string;
  role: string;
}

// DTOs para la administración de trabajadores (CRUD)
export interface RegisterRequestDto {
  dni: string;
  name: string;
  email: string;
  password: string;
  idRole: number;
  idAccountState: number;
}

export interface UpdateUserRequestDto {
  idAccount: number;
  dni: string;
  name: string;
  email: string;
  password?: string;
  idRole: number;
  idAccountState: number;
}

export interface UserDetailsDto {
  idAccount: number;
  dni: string;
  name: string;
  email: string;
  registrationDate: string;
  idRole: number;
  roleName: string;
  idAccountState: number;
  stateName: string;
}

// DTOs para el manejo de filtros y la respuesta paginada de 15 registros
export interface UserFilterRequestDto {
  searchTerm?: string;
  idRole?: number;
  idAccountState?: number;
  pageNumber: number;
  pageSize: number;
}

export interface PagedResultDto<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  totalPages: number;
}

// 🚀 NUEVOS MODELOS ADICIONALES PARA EL RESUMEN Y COMBOS DE TRABAJADORES
export interface RoleLookupDto {
  idRole: number;
  roleName: string;
}

export interface AccountStateLookupDto {
  idAccountState: number;
  stateName: string;
}

export interface WorkersPageSummaryDto {
  superAdminsCount: number;
  contentEditorsCount: number;
  supportStaffCount: number;
  roles: RoleLookupDto[];
  accountStates: AccountStateLookupDto[];
}