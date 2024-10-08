import { Especie } from './especie';

describe('Especie', () => {
  it('should create an instance', () => {
    const especie = new Especie(1, 'Gato');
    expect(especie).toBeTruthy();
    expect(especie.id_especie).toBe(1);
    expect(especie.nombre_especie).toBe('Gato');
  });
});
