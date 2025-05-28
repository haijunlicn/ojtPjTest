import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaygitComponent } from './maygit.component';

describe('MaygitComponent', () => {
  let component: MaygitComponent;
  let fixture: ComponentFixture<MaygitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaygitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaygitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
