import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserDetailsDto, RoleLookupDto, AccountStateLookupDto } from '../../models/authentication.model';

@Component({
  selector: 'app-edit-worker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-worker-modal.component.html',
  styleUrl: './edit-worker-modal.component.scss',
})
export class EditWorkerModalComponent implements OnChanges {
  // 📥 Recibimos los datos y las colecciones maestras desde la página padre
  @Input() trabajador: UserDetailsDto | null = null;
  @Input() roles: RoleLookupDto[] = [];
  @Input() estados: AccountStateLookupDto[] = [];

  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<any>();

  // Clon local estructurado para edición segura
  trabajadorEditado: any = {
    idAccount: 0,
    name: '',
    dni: '',
    email: '',
    idRole: '',
    idAccountState: ''
  };

  // Detecta variaciones en el Input y clona el objeto real de forma segura
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trabajador'] && this.trabajador) {
      this.trabajadorEditado = {
        idAccount: this.trabajador.idAccount,
        name: this.trabajador.name,
        dni: this.trabajador.dni,
        email: this.trabajador.email,
        idRole: this.trabajador.idRole,
        idAccountState: this.trabajador.idAccountState
      };
    }
  }

  cerrar(): void {
    this.onClose.emit();
  }

  guardar(): void {
    if (!this.trabajadorEditado.name || !this.trabajadorEditado.dni || !this.trabajadorEditado.email) {
      alert('Por favor, rellene los campos obligatorios.');
      return;
    }

    // Estructura limpia lista para ser serializada por la API en C# (UpdateUserRequestDto)
    const dtoModificado = {
      idAccount: this.trabajadorEditado.idAccount,
      dni: this.trabajadorEditado.dni,
      name: this.trabajadorEditado.name,
      email: this.trabajadorEditado.email,
      idRole: Number(this.trabajadorEditado.idRole),
      idAccountState: Number(this.trabajadorEditado.idAccountState),
      password: "" // Se deja vacío a menos que desees implementar cambio de clave en esta vista
    };

    this.onUpdate.emit(dtoModificado);
  }
}