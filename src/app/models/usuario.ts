export class Usuario {
    id_usuario: number;
    nombre_usuario: string;
    correo_usuario: string;
    contrasena_usuario: string;
    id_rol: number;
    telefono: number; 
    foto?: string; 
  
    constructor(
      id_usuario: number,
      nombre_usuario: string,
      correo_usuario: string,
      contrasena_usuario: string,
      id_rol: number,
      telefono: number, 
      foto?: string 
    ) {
      this.id_usuario = id_usuario;
      this.nombre_usuario = nombre_usuario;
      this.correo_usuario = correo_usuario;
      this.contrasena_usuario = contrasena_usuario;
      this.id_rol = id_rol;
      this.telefono = telefono; 
      this.foto = foto; 
    }
  }
  
