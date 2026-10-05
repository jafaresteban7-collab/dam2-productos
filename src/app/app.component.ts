import { Component, signal } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonButton],
})
export class AppComponent {
  dark = signal(localStorage.getItem('dark') === 'true');

  constructor() {
    this.apply();
  }

  toggleDark(): void {
    this.dark.update(v => !v);
    localStorage.setItem('dark', String(this.dark()));
    this.apply();
  }

  private apply(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.dark());
  }
}