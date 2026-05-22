import { Component } from '@angular/core';
import { SidebarComponent } from "../../features/admin/components/sidebar/sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin.layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin.layout.html',
  styleUrl: './admin.layout.scss',
})
export class AdminLayout {
sidebarActivo: any;

}
