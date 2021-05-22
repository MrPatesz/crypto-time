import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsRealTimeComponent } from './coins-real-time.component';

describe('CoinsRealTimeComponent', () => {
  let component: CoinsRealTimeComponent;
  let fixture: ComponentFixture<CoinsRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinsRealTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinsRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
