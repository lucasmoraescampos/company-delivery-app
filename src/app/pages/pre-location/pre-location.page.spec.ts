import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreLocationPage } from './pre-location.page';

describe('PreLocationPage', () => {
  let component: PreLocationPage;
  let fixture: ComponentFixture<PreLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
