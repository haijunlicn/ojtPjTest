import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalMap: { [key: string]: boolean } = {};

  constructor() { }

  open(modalName: string) {

    console.log('Opening modal:', modalName);
    this.modalMap[modalName] = true;
  }

  close(modalName: string) {
    this.modalMap[modalName] = false;
  }

  isOpen(modalName: string): boolean {
    return !!this.modalMap[modalName];
  }
}
