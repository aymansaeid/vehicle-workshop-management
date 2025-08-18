import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersCarsComponent } from './customers-cars.component';

describe('CustomersCarsComponent', () => {
  let component: CustomersCarsComponent;
  let fixture: ComponentFixture<CustomersCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersCarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
