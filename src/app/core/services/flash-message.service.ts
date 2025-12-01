import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlashMessageService {

  message = signal<string | null>(null);
  type = signal<'success' | 'error' | null>(null);

  showSuccess(msg: string) {
    this.message.set(msg);
    this.type.set('success');
    this.autoClear();
  }

  showError(msg: string) {
    this.message.set(msg);
    this.type.set('error');
    this.autoClear();
  }

  private autoClear() {
    setTimeout(() => {
      this.message.set(null);
      this.type.set(null);
    }, 3000);
  }
}
