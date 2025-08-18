import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoreListComponent } from './inventore-list.component';

describe('InventoreListComponent', () => {
  let component: InventoreListComponent;
  let fixture: ComponentFixture<InventoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoreListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
