import { Component } from '@angular/core';
import { NewWorkerModalComponent } from "../../components/new-worker-modal/new-worker-modal.component";
import { EditWorkerModalComponent } from "../../components/edit-worker-modal/edit-worker-modal.component";
import {NgClass} from "@angular/common";
@Component({
  selector: 'app-workers.page',
  imports: [NewWorkerModalComponent, EditWorkerModalComponent, NgClass],
  templateUrl: './workers.page.html',
  styleUrl: './workers.page.scss',
})
export class WorkersPage {
  // Banderas de control de estado para los modales
  mostrarModal: boolean = false;
  mostrarEditarModal: boolean = false;
  trabajadorSeleccionado: any = null;

  // Tu fuente de datos unificada para que se renderice dinámicamente
  trabajadores = [
    { nombre: 'Juan Martínez', correo: 'j.martinez@tingogo.com', dni: '72145896', rol: 'Super Admin', alta: '12 Mar 2026', estado: 'Activo', iniciales: 'JM', bgClass: 'bg-emerald' },
    { nombre: 'Sofia Paredes', correo: 's.paredes@tingogo.com', dni: '45781236', rol: 'Editor de Contenido', alta: '05 Abr 2026', estado: 'Activo', iniciales: 'sp', bgClass: 'bg-turquesa' },
    { nombre: 'Ricardo Chávez', correo: 'r.chavez@tingogo.com', dni: '09874521', rol: 'Soporte Técnico', alta: '20 Ene 2026', estado: 'Inactivo', iniciales: 'RC', bgClass: 'bg-secondary' }
  ];

  // Acciones de registro
  manejarGuardado(nuevoTrabajador: any) {
    console.log('Guardando nuevo trabajador:', nuevoTrabajador);
    // Tu lógica de inserción aquí...
    this.mostrarModal = false;
  }

  // Acciones de edición quirúrgica
  abrirEditar(trabajador: any) {
    this.trabajadorSeleccionado = trabajador;
    this.mostrarEditarModal = true;
  }

  manejarActualizacion(trabajadorModificado: any) {
    console.log('Actualizando datos en el backend:', trabajadorModificado);

    // Actualizamos el estado local de la grilla de manera inmediata
    const index = this.trabajadores.findIndex(t => t.dni === trabajadorModificado.dni);
    if (index !== -1) {
      this.trabajadores[index] = trabajadorModificado;
    }
    this.mostrarEditarModal = false;
  }

}
