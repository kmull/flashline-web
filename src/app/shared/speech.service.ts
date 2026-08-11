import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {

  speak(text: string, lang: string = 'en-US'): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API nie jest dostępne w tej przeglądarce');
      return;
    }

    speechSynthesis.cancel(); // Anuluj wszelkie bieżące wypowiedzi

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }

}
