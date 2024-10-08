export class Categoria {
    id_categoria!: number;
    nombre_categoria!: string;
  
    constructor(id_categoria: number, nombre_categoria: string) {
      this.id_categoria = id_categoria;
      this.nombre_categoria = nombre_categoria;
    }
  }
  