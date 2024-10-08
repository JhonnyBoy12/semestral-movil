import { Ubicacion } from './ubicacion';

describe('Ubicacion', () => {
  it('should create an instance', () => {
    const ubicacion = new Ubicacion(1, 'Clínica Veterinaria', 'Calle Falsa 123', 'Local 1', 'Clínica de animales', '09:00-19:00', 'imagen.png', '123456789', 1, 1, -33.4489, -70.6693, 'tipo', true, 1, 1, 1);
    expect(ubicacion).toBeTruthy();
    expect(ubicacion.id_ubicacion).toBe(1);
    expect(ubicacion.nombre_ubicacion).toBe('Clínica Veterinaria');
  });
});
