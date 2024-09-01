import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-ubicaciones',
  templateUrl: './info-ubicaciones.page.html',
  styleUrls: ['./info-ubicaciones.page.scss'],
})
export class InfoUbicacionesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  mensajeProvisorio(){
    this.router.navigate(['/info-ubicaciones']);
  }

}
