import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { Material } from '../../models/materials/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private http = inject(HttpClient);

  // GET → JSON
  getAll() {
    return this.http.get<Material[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getAll}`, { responseType: 'json' });
  }

  getById(id: number) {
    return this.http.get<Material>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getById(id)}`, { responseType: 'json' });
  }

  search(typeName: string) {
    return this.http.get<Material[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getByType(typeName)}`, { responseType: 'json' });
  }

  // POST → TEXT
  create(model: Material) {
    return this.http.post(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.create}`, model, { responseType: 'text' });
  }

  // PUT → TEXT
  update(id: number, body: Material) {
    return this.http.put(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.update(id)}`, body, { responseType: 'text' });
  }

  // DELETE → TEXT
  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.delete(id)}`, { responseType: 'text' });
  }
}
