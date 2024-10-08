import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agregar-ubicacion',
  templateUrl: './agregar-ubicacion.page.html',
  styleUrls: ['./agregar-ubicacion.page.scss'],
})
export class AgregarUbicacionPage implements OnInit {

  nombreUbicacion: string ="";

  direccion: string ="";

  subtitulo: string="";

  constructor() { }

  ngOnInit() {
  }

}
