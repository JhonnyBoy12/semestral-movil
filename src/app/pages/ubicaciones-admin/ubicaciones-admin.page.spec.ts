import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbicacionesAdminPage } from './ubicaciones-admin.page';

describe('UbicacionesAdminPage', () => {
  let component: UbicacionesAdminPage;
  let fixture: ComponentFixture<UbicacionesAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionesAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
