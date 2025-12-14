import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateFactoryDto, UpdateFactoryDto, MaterialDto, ApplicationUserDto } from '../models/dtos.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:4375/api';

  // ===== USER MANAGEMENT =====

  /** Admin: Get all users */
  getAllUsers(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${this.apiUrl}/User`);
  }

  /** Admin: Get user by ID */
  getUser(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${this.apiUrl}/User/${id}`);
  }

  /** Admin: Delete user */
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/User/${id}`);
  }

  // ===== FACTORY MANAGEMENT =====

  /** Admin: Get all factories */
  getAllFactories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Factory`);
  }

  /** Admin: Get factory by ID */
  getFactory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Factory/${id}`);
  }

  /** Admin: Get factory details */
  getFactoryDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Factory/${id}/details`);
  }

  /** Admin: Create factory */
  createFactory(dto: CreateFactoryDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Factory`, dto);
  }

  /** Admin: Update factory */
  updateFactory(dto: UpdateFactoryDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Factory`, dto);
  }

  /** Admin: Delete factory */
  deleteFactory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Factory/${id}`);
  }

  // ===== MATERIAL MANAGEMENT =====

  /** Admin: Get all materials */
  getAllMaterials(): Observable<MaterialDto[]> {
    return this.http.get<MaterialDto[]>(`${this.apiUrl}/Material`);
  }

  /** Admin: Get material by ID */
  getMaterial(id: number): Observable<MaterialDto> {
    return this.http.get<MaterialDto>(`${this.apiUrl}/Material/${id}`);
  }

  /** Admin: Get material by type */
  getMaterialByType(typeName: string): Observable<MaterialDto> {
    return this.http.get<MaterialDto>(`${this.apiUrl}/Material/type/${typeName}`);
  }

  /** Admin: Create material */
  createMaterial(dto: MaterialDto): Observable<MaterialDto> {
    return this.http.post<MaterialDto>(`${this.apiUrl}/Material`, dto);
  }

  /** Admin: Update material */
  updateMaterial(id: number, dto: MaterialDto): Observable<MaterialDto> {
    return this.http.put<MaterialDto>(`${this.apiUrl}/Material/${id}`, dto);
  }

  /** Admin: Delete material */
  deleteMaterial(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Material/${id}`);
  }
}
