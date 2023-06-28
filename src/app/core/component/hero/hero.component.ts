import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FieldPattern} from '../../utils/field-pattern';

declare var particlesJS: any;
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent implements OnInit {
  public phonePattern = FieldPattern.phonePattern;

  ngOnInit() {
    particlesJS.load('particles-container', '../../../../assets/script/particles/particles.json', null);
  }
}
