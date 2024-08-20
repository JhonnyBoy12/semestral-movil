import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoUbicacionesPage } from './info-ubicaciones.page';

describe('InfoUbicacionesPage', () => {
  let component: InfoUbicacionesPage;
  let fixture: ComponentFixture<InfoUbicacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoUbicacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
