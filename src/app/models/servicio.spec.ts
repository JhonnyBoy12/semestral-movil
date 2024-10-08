import { Servicio } from './servicio';

describe('Servicio', () => {
  it('should create an instance', () => {
    const servicio = new Servicio(1, 'Baño');
    expect(servicio).toBeTruthy();
    expect(servicio.id_servicio).toBe(1);
    expect(servicio.nombre_servicio).toBe('Baño');
  });
});

