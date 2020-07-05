import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComplementOptionsPage } from './complement-options.page';

describe('ComplementOptionsPage', () => {
  let component: ComplementOptionsPage;
  let fixture: ComponentFixture<ComplementOptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplementOptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComplementOptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
