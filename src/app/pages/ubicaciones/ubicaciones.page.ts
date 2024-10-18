import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';


@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: ['./ubicaciones.page.scss'],
})
export class UbicacionesPage implements OnInit {

  ubicaciones: any []=[];
  
  constructor(private router: Router, private bd:ServicebdService) { }
  
  ngOnInit() {
    this.cargarUbicaciones();
  }

  cargarUbicaciones(){
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.consultarUbicaciones().then(res => {
          this.ubicaciones = res; 
        }).catch(error => {
          console.error("Error al cargar las ubicaciones:", error);
        });
      }
    });
  }



  detalleUbicacion(ubicacion: any){
    let navigationExtras: NavigationExtras = {
      state: {
        detalleUbicacion : ubicacion
      }
    }
    this.router.navigate(['/info-ubicaciones'], navigationExtras);
  }

}
