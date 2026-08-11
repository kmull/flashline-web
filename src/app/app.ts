import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('flashline-web');

  // speechService = inject(SpeechService);

  // constructor() {
  //   console.log('start')
  //   this.speechService.speak('How is going?', 'en-US');
  // }
}
