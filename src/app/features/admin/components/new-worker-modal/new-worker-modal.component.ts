import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-worker-modal',
  imports: [],
  templateUrl: './new-worker-modal.component.html',
  styleUrl: './new-worker-modal.component.scss',
})
export class NewWorkerModalComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  cerrar() {
    this.onClose.emit();
  }

  guardar() {
    // Aquí podrías recolectar los datos del formulario (usando Reactive Forms o Template Driven)
    this.onSave.emit({ nombre: 'Nuevo Trabajador' });
    this.cerrar();
  }
}
