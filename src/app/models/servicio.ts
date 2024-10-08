export class Servicio {
    id_servicio!: number;
    nombre_servicio!: string;
  
    constructor(id_servicio: number, nombre_servicio: string) {
      this.id_servicio = id_servicio;
      this.nombre_servicio = nombre_servicio;
    }
  }