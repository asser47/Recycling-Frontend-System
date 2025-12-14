import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private http = inject(HttpClient);
  private base = 'https://localhost:4375/api/Material';

  // GET → JSON
  getAll() {
    return this.http.get<Material[]>(this.base, { responseType: 'json' });
  }

  getById(id: number) {
    return this.http.get<Material>(`${this.base}/${id}`, { responseType: 'json' });
  }

  search(typeName: string) {
    return this.http.get<Material[]>(`${this.base}/type/${typeName}`, { responseType: 'json' });
  }

  // POST → TEXT
  create(model: Material) {
    return this.http.post(this.base, model, { responseType: 'text' });
  }

  // PUT → TEXT
  update(id: number, body: Material) {
    return this.http.put(`${this.base}/${id}`, body, { responseType: 'text' });
  }

  // DELETE → TEXT
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`, { responseType: 'text' });
  }
}
