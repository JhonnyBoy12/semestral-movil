import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ubicaciones-admin',
  templateUrl: './ubicaciones-admin.page.html',
  styleUrls: ['./ubicaciones-admin.page.scss'],
})
export class UbicacionesAdminPage implements OnInit {

  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
    

  constructor(private router: Router) { }
 
  ngOnInit() {
  }
}
