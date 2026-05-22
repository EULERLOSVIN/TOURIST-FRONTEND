import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
  @Input() placeName: string = '';

  // Eventos para avisar al componente padre
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirmar(): void {
    this.onConfirm.emit();
  }

  cancelar(): void {
    this.onCancel.emit();
  }
}
