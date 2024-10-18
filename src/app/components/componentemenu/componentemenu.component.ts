import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-componentemenu',
  templateUrl: './componentemenu.component.html',
  styleUrls: ['./componentemenu.component.scss'],
})
export class ComponentemenuComponent implements OnInit {

  @Input() telefono!: string;
  telefonoWhatsApp: string = '';
  telefonoLlamada: string = '';

  constructor() { }

  ngOnInit() {
    // Formatear el teléfono para llamada y WhatsApp
    this.telefonoWhatsApp = `+56 9 ${this.telefono}`;
    this.telefonoLlamada = `9 ${this.telefono}`;
  }

}

