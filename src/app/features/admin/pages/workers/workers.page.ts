import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewWorkerModalComponent } from "../../components/new-worker-modal/new-worker-modal.component";
import { EditWorkerModalComponent } from "../../components/edit-worker-modal/edit-worker-modal.component";
import { DeleteWorkerModalComponent } from "../../components/delete-worker-modal/delete-worker-modal.component";
import { AuthenticationService } from '../../services/authentication.service';
import { UserDetailsDto, RoleLookupDto, AccountStateLookupDto, WorkersPageSummaryDto, PagedResultDto } from '../../models/authentication.model';
import { Result } from '../../../../shared/models/result.model';

@Component({
  selector: 'app-workers.page',
  standalone: true,
  imports: [CommonModule, FormsModule, NewWorkerModalComponent, EditWorkerModalComponent, DeleteWorkerModalComponent, NgClass],
  templateUrl: './workers.page.html',
  styleUrl: './workers.page.scss',
})
export class WorkersPage implements OnInit {
  private readonly authService = inject(AuthenticationService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Banderas de control de estado para los modales
  mostrarModal: boolean = false;
  mostrarEditarModal: boolean = false;
  mostrarEliminarModal: boolean = false;

  trabajadorSeleccionado: UserDetailsDto | null = null;

  // Fuente de datos unificada (Grilla dinámica)
  trabajadores: UserDetailsDto[] = [];

  // Variables para los contadores de las tarjetas superiores
  superAdminsCount: number = 0;
  contentEditorsCount: number = 0;
  supportStaffCount: number = 0;

  // Listas de referencias para cargar los combos de los filtros
  rolesList: RoleLookupDto[] = [];
  statesList: AccountStateLookupDto[] = [];

  // Modelos enlazados bidireccionalmente a los filtros de la interfaz [(ngModel)]
  searchTerm: string = '';
  selectedRole: string = '';
  selectedState: string = '';

  // Configuración base de paginación
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  ngOnInit(): void {
    this.cargarMetadatosDashboard();
    this.cargarListaTrabajadores();
  }

  // 📊 Recupera contadores superiores y datos para los <select>
  cargarMetadatosDashboard(): void {
    this.authService.getWorkersSummary().subscribe({
      next: (response: Result<WorkersPageSummaryDto>) => {
        if (response.isSuccess && response.value) {
          const data = response.value;
          this.superAdminsCount = data.superAdminsCount;
          this.contentEditorsCount = data.contentEditorsCount;
          this.supportStaffCount = data.supportStaffCount;
          this.rolesList = data.roles;
          this.statesList = data.accountStates;
          this.cdr.detectChanges();
        }
      },
      error: (err: unknown) => console.error('Error al cargar métricas iniciales:', err)
    });
  }

  // 📋 Carga la grilla de usuarios aplicando filtros asíncronos en el backend
  cargarListaTrabajadores(): void {
    const filtros = {
      searchTerm: this.searchTerm,
      idRole: this.selectedRole ? Number(this.selectedRole) : undefined,
      idAccountState: this.selectedState ? Number(this.selectedState) : undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.authService.getPagedUsers(filtros).subscribe({
      next: (response: Result<PagedResultDto<UserDetailsDto>>) => {
        if (response.isSuccess && response.value) {
          this.trabajadores = response.value.items;
          this.totalPages = response.value.totalPages || 1;
          this.cdr.detectChanges();
        }
      },
      error: (err: unknown) => console.error('Error al cargar la grilla de personal:', err)
    });
  }

  // 🔄 Métodos de navegación para la paginación
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.pageNumber = nuevaPagina;
      this.cargarListaTrabajadores();
    }
  }

  // Captura el tecleo o cambio en los filtros y reinicia la paginación
  onFiltrosChanged(): void {
    this.pageNumber = 1;
    this.cargarListaTrabajadores();
  }

  // 🎨 Generador de iniciales dinámicas para mantener la estética original
  getIniciales(nombre: string): string {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ');
    return partes.length > 1
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : partes[0][0].toUpperCase();
  }

  // Asigna dinámicamente las clases de color de fondo y texto correctas para los avatares
  getAvatarBgClass(roleName: string): string {
    if (!roleName) return 'bg-secondary text-white';

    const name = roleName.toLowerCase();

    if (name.includes('admin')) return 'bg-emerald text-white';
    if (name.includes('editor')) return 'bg-success text-white';

    return 'bg-dark-slate text-white';
  }

  // Acciones de registro integrado
  manejarGuardado(nuevoTrabajador: any): void {
    this.authService.registerUser(nuevoTrabajador).subscribe({
      next: (response: Result<boolean>) => {
        if (response.isSuccess) {
          this.mostrarModal = false;
          this.cargarMetadatosDashboard();
          this.cargarListaTrabajadores();
        }
      },
      error: (err: unknown) => console.error('Error al registrar trabajador:', err)
    });
  }

  // Acciones de edición quirúrgica
  abrirEditar(trabajador: UserDetailsDto): void {
    this.trabajadorSeleccionado = { ...trabajador };
    this.mostrarEditarModal = true;
  }

  manejarActualizacion(trabajadorModificado: any): void {
    this.authService.updateUser(trabajadorModificado).subscribe({
      next: (response: Result<boolean>) => {
        if (response.isSuccess) {
          this.mostrarEditarModal = false;
          this.cargarMetadatosDashboard();
          this.cargarListaTrabajadores();
        }
      },
      error: (err: unknown) => console.error('Error al actualizar permisos:', err)
    });
  }

  // 🔄 Alternar estado utilizando el endpoint de update del Backend
  alternarEstadoTrabajador(trabajador: UserDetailsDto): void {
    const nuevoEstadoId = trabajador.idAccountState === 1 ? 2 : 1;

    const editDto = {
      idAccount: trabajador.idAccount,
      dni: trabajador.dni,
      name: trabajador.name,
      email: trabajador.email,
      idRole: trabajador.idRole,
      idAccountState: nuevoEstadoId
    };

    this.authService.updateUser(editDto).subscribe({
      next: (response: Result<boolean>) => {
        if (response.isSuccess) {
          this.cargarMetadatosDashboard();
          this.cargarListaTrabajadores();
        }
      },
      error: (err: unknown) => console.error('Error al cambiar estado del personal:', err)
    });
  }

  // 🗑️ Inicializar modal de borrado físico
  abrirEliminar(trabajador: UserDetailsDto): void {
    this.trabajadorSeleccionado = { ...trabajador };
    this.mostrarEliminarModal = true;
  }

  // 🛑 Ejecución definitiva: Forzamos la conversión a Number para evitar falsos nulos
  manejarEliminacion(idAccount: any): void {
    const idConvertido = Number(idAccount);

    this.authService.deleteUser(idConvertido).subscribe({
      next: (response: Result<boolean>) => {
        if (response.isSuccess) {
          this.mostrarEliminarModal = false;
          this.cargarMetadatosDashboard(); // Refresca contadores
          this.cargarListaTrabajadores();   // Refresca grilla
        }
      },
      error: (err: unknown) => console.error('Error al procesar eliminación en API:', err)
    });
  }

  // 🏷️ Retorna la clase CSS correspondiente según el rol de forma flexible
  getRoleBadgeClass(roleName: string): string {
    if (!roleName) return 'soporte';

    const name = roleName.toLowerCase();

    if (name.includes('admin')) return 'super-admin';
    if (name.includes('editor') || name.includes('contenido')) return 'editor';
    if (name.includes('soporte') || name.includes('técnico') || name.includes('tecnico')) return 'soporte';

    return 'soporte';
  }
}