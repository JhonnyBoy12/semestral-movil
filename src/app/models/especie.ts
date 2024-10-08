export class Especie {
    id_especie!: number;
    nombre_especie!: string;
  
    constructor(id_especie: number, nombre_especie: string) {
      this.id_especie = id_especie;
      this.nombre_especie = nombre_especie;
    }
  }
  