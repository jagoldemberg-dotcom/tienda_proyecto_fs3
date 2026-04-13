import { Injectable } from "@angular/core";
@Injectable({ providedIn: "root" }) export class StorageService { getItem<T>(key: string, fallback: T): T { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } setItem<T>(key: string, value: T): void { localStorage.setItem(key, JSON.stringify(value)); } }
