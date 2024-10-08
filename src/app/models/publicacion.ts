export class Publicacion {
    id_publicacion!: number;
    id_usuario!: number;
    titulo!: string;
    foto!: string;
    descripcion!: string;
    fecha_publicacion!: Date;
    fecha_baneo?: Date;
    descripcion_baneo?: string;
    publicacion_adopcion!: boolean;
    id_categoria!: number;
  
    constructor(
      id_publicacion: number,
      id_usuario: number,
      titulo: string,
      foto: string,
      descripcion: string,
      fecha_publicacion: Date,
      publicacion_adopcion: boolean,
      id_categoria: number,
      fecha_baneo?: Date,
      descripcion_baneo?: string
    ) {
      this.id_publicacion = id_publicacion;
      this.id_usuario = id_usuario;
      this.titulo = titulo;
      this.foto = foto;
      this.descripcion = descripcion;
      this.fecha_publicacion = fecha_publicacion;
      this.publicacion_adopcion = publicacion_adopcion;
      this.id_categoria = id_categoria;
      this.fecha_baneo = fecha_baneo;
      this.descripcion_baneo = descripcion_baneo;
    }
  }
  
