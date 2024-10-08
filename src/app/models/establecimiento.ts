export class Establecimiento {
    id_establecimiento!: number;
    tipo_establecimiento!: string;
  
    constructor(id_establecimiento: number, tipo_establecimiento: string) {
      this.id_establecimiento = id_establecimiento;
      this.tipo_establecimiento = tipo_establecimiento;
    }
  }
  
