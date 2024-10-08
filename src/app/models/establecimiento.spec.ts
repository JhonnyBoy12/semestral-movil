import { Establecimiento } from './establecimiento';

describe('Establecimiento', () => {
  it('should create an instance', () => {
    const establecimiento = new Establecimiento(1, 'Veterinaria');
    expect(establecimiento).toBeTruthy();
    expect(establecimiento.id_establecimiento).toBe(1);
    expect(establecimiento.tipo_establecimiento).toBe('Veterinaria');
  });
});
