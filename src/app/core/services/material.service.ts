import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Material } from '../models/material.model';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class MaterialService {

  private url = `${API_CONFIG.baseUrl}/material`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Material[]>(this.url);
  }

  getById(id: number) {
    return this.http.get<Material>(`${this.url}/${id}`);
  }

  create(data: Partial<Material>) {
    const body = { ...data };
    delete body.id; // مهم: سيب الباك يولد id
    return this.http.post<Material>(this.url, body);
  }

  update(id: number, data: Partial<Material>) {
    return this.http.put<Material>(`${this.url}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}