import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: ['./ubicaciones.page.scss'],
})
export class UbicacionesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  mensajeProvisorio(){
    this.router.navigate(['/info-ubicaciones']);
  }

}
