import { Injectable } from '@angular/core';
import { KeyValueStorage } from '../models';

@Injectable()
export class LocalStorageService implements KeyValueStorage {
  async loadData<T>(key: string): Promise<T | null> {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  }

  async storeData<T>(key: string, value: T): Promise<void> {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  async removeData(key: string): Promise<void> {
    return localStorage.removeItem(key);
  }

  async loadKeys(): Promise<string[]> {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i) ?? '');
    }

    return keys;
  }
}
