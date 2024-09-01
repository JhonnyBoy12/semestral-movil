import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publicaciones-admin',
  templateUrl: './publicaciones-admin.page.html',
  styleUrls: ['./publicaciones-admin.page.scss'],
})
export class PublicacionesAdminPage implements OnInit {
  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
    


  constructor() { }

  ngOnInit() {
  }

}
