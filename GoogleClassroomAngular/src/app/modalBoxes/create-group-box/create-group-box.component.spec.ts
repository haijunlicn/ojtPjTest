import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupBoxComponent } from './create-group-box.component';

describe('CreateGroupBoxComponent', () => {
  let component: CreateGroupBoxComponent;
  let fixture: ComponentFixture<CreateGroupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGroupBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
