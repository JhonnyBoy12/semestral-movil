import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-cambiar-nombre',
  templateUrl: './cambiar-nombre.page.html',
  styleUrls: ['./cambiar-nombre.page.scss'],
})
export class CambiarNombrePage implements OnInit {
  nombreRecibido: any;
  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
  }

}
