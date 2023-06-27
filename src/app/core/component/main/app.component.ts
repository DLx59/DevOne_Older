import {Component} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // constructor(private elementRef: ElementRef) {}
  //
  // ngAfterViewInit(): void {
  //   const heroOverlayText = this.elementRef.nativeElement.querySelector('.hero-overlay-text');
  //
  //   document.addEventListener('mousemove', (event: MouseEvent) => {
  //     const rect = heroOverlayText.getBoundingClientRect();
  //     const centerX = rect.left + rect.width / 2;
  //     const centerY = rect.top + rect.height / 2;
  //     const offsetX = event.clientX - centerX;
  //     const offsetY = event.clientY - centerY;
  //
  //     gsap.to(heroOverlayText, {
  //       rotationX: offsetY * 0.1,
  //       rotationY: offsetX * -0.1,
  //       ease: 'power2.out',
  //       duration: 0.3
  //     });
  //   });
  // }

}
