export class PublicacionGuardada {
    id_guardado!: number;
    id_usuario!: number;
    id_publicacion!: number;
  
    constructor(id_guardado: number, id_usuario: number, id_publicacion: number) {
      this.id_guardado = id_guardado;
      this.id_usuario = id_usuario;
      this.id_publicacion = id_publicacion;
    }
  }
  