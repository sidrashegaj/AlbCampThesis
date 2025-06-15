import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampgroundsComponent } from './admin-campgrounds.component';

describe('AdminCampgroundsComponent', () => {
  let component: AdminCampgroundsComponent;
  let fixture: ComponentFixture<AdminCampgroundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCampgroundsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCampgroundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
