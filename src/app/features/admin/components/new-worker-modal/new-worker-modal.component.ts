import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleLookupDto, AccountStateLookupDto } from '../../models/authentication.model';

@Component({
  selector: 'app-new-worker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-worker-modal.component.html',
  styleUrl: './new-worker-modal.component.scss',
})
export class NewWorkerModalComponent {
  // 📥 Recibimos las listas dinámicas de SQL Server desde la página principal
  @Input() roles: RoleLookupDto[] = [];
  @Input() estados: AccountStateLookupDto[] = [];

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  // Modelo de datos local para capturar el formulario reactivo
  name = '';
  dni = '';
  email = '';
  password = '';
  idRole: number | string = '';

  cerrar() {
    this.onClose.emit();
  }

  guardar() {
    // Validación básica antes de despachar el comando
    if (!this.name || !this.dni || !this.email || !this.password || !this.idRole) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Estructura idéntica al RegisterRequestDto que espera tu backend en C#
    const nuevoTrabajador = {
      dni: this.dni,
      name: this.name,
      email: this.email,
      password: this.password,
      idRole: Number(this.idRole),
      idAccountState: 1 // Por defecto entran con estado 'Activo' (ID 1)
    };

    this.onSave.emit(nuevoTrabajador);
  }
}