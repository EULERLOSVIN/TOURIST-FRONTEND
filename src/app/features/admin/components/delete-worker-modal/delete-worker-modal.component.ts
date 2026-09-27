import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsDto } from '../../models/authentication.model';

@Component({
  selector: 'app-delete-worker-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-worker-modal.component.html',
  styleUrl: './delete-worker-modal.component.scss',
})
export class DeleteWorkerModalComponent {
  // 📥 Recibimos al trabajador seleccionado desde la grilla principal
  @Input() trabajador: UserDetailsDto | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDeleteConfirm = new EventEmitter<number>(); // 📤 Envía el ID exacto a eliminar

  cerrar(): void {
    this.onClose.emit();
  }

  confirmarEliminacion(): void {
    if (this.trabajador && this.trabajador.idAccount) {
      this.onDeleteConfirm.emit(this.trabajador.idAccount);
      this.cerrar();
    }
  }
}