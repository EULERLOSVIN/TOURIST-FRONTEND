import { Component, EventEmitter, Input, Output } from '@angular/core';
import {CommonModule} from "@angular/common";
import { NewWorkerModalComponent } from "../new-worker-modal/new-worker-modal.component"; 
@Component({
  selector: 'app-edit-worker-modal',
  imports: [CommonModule],
  templateUrl: './edit-worker-modal.component.html',
  styleUrl: './edit-worker-modal.component.scss',
})
export class EditWorkerModalComponent {
  // Recibe el objeto completo del trabajador desde la tabla
  @Input() trabajador: any;

  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<any>();

  // Clon local para editar de forma segura sin romper la tabla antes de guardar
  trabajadorEditado: any = {};

  ngOnInit(): void {
    if (this.trabajador) {
      this.trabajadorEditado = { ...this.trabajador };
    }
  }

  cerrar(): void {
    this.onClose.emit();
  }

  guardar(): void {
    this.onUpdate.emit(this.trabajadorEditado);
    this.cerrar();
  }
}
