export class Ubicacion {
    id_ubicacion!: number;
    nombre_ubicacion!: string;
    direccion!: string;
    sububicacion!: string;
    descripcion_ubicacion!: string;
    horario!: string;
    imagen_ubicacion!: string;
    telefono_lugar!: string;
    id_administrador!: number;
    id_comuna!: number;
    latitud!: string;
    longitud!: string;
    tipo_marcador!: string;
    visibilidad!: boolean;
    id_establecimiento?: number;
    id_especie?: number;
    id_servicio?: number;
  
    constructor(
      id_ubicacion: number,
      nombre_ubicacion: string,
      direccion: string,
      sububicacion: string,
      descripcion_ubicacion: string,
      horario: string,
      imagen_ubicacion: string,
      telefono_lugar: string,
      id_administrador: number,
      id_comuna: number,
      latitud: string,
      longitud: string,
      tipo_marcador: string,
      visibilidad: boolean,
      id_establecimiento?: number,
      id_especie?: number,
      id_servicio?: number
    ) {
      this.id_ubicacion = id_ubicacion;
      this.nombre_ubicacion = nombre_ubicacion;
      this.direccion = direccion;
      this.sububicacion = sububicacion;
      this.descripcion_ubicacion = descripcion_ubicacion;
      this.horario = horario;
      this.imagen_ubicacion = imagen_ubicacion;
      this.telefono_lugar = telefono_lugar;
      this.id_administrador = id_administrador;
      this.id_comuna = id_comuna;
      this.latitud = latitud;
      this.longitud = longitud;
      this.tipo_marcador = tipo_marcador;
      this.visibilidad = visibilidad;
      this.id_establecimiento = id_establecimiento;
      this.id_especie = id_especie;
      this.id_servicio = id_servicio;
    }
  }
  