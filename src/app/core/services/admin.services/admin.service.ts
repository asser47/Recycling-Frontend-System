import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { ApplicationUserDto } from '../../models/users/application-user.model';
import { MaterialDto } from '../../models/materials/material.model';
import { CreateFactoryDto, UpdateFactoryDto} from '../../models/factories/factory.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private http = inject(HttpClient);

  // ===== USER MANAGEMENT =====

  /** Admin: Get all users */
  getAllUsers(): Observable<ApplicationUserDto[]> {
    return this.http.get<ApplicationUserDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getAll}`);
  }

  /** Admin: Get user by ID */
  getUser(id: string): Observable<ApplicationUserDto> {
    return this.http.get<ApplicationUserDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.getById(id)}`);
  }

  /** Admin: Delete user */
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.users.delete(id)}`);
  }

  // ===== FACTORY MANAGEMENT =====

  /** Admin: Get all factories */
  getAllFactories(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getAll}`);
  }

  /** Admin: Get factory by ID */
  getFactory(id: number): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getById(id)}`);
  }

  /** Admin: Get factory details */
  getFactoryDetails(id: number): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.getDetails(id)}`);
  }

  /** Admin: Create factory */
  createFactory(dto: CreateFactoryDto): Observable<any> {
    return this.http.post<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.create}`, dto);
  }

  /** Admin: Update factory */
  updateFactory(dto: UpdateFactoryDto): Observable<any> {
    return this.http.put<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.update(dto.id)}`, dto);
  }

  /** Admin: Delete factory */
  deleteFactory(id: number): Observable<any> {
    return this.http.delete<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.factories.delete(id)}`);
  }

  // ===== MATERIAL MANAGEMENT =====

  /** Admin: Get all materials */
  getAllMaterials(): Observable<MaterialDto[]> {
    return this.http.get<MaterialDto[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getAll}`);
  }

  /** Admin: Get material by ID */
  getMaterial(id: number): Observable<MaterialDto> {
    return this.http.get<MaterialDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getById(id)}`);
  }

  /** Admin: Get material by type */
  getMaterialByType(typeName: string): Observable<MaterialDto> {
    return this.http.get<MaterialDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.getByType(typeName)}`);
  }

  /** Admin: Create material */
  createMaterial(dto: MaterialDto): Observable<MaterialDto> {
    return this.http.post<MaterialDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.create}`, dto);
  }

  /** Admin: Update material */
  updateMaterial(id: number, dto: MaterialDto): Observable<MaterialDto> {
    return this.http.put<MaterialDto>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.update(id)}`, dto);
  }

  /** Admin: Delete material */
  deleteMaterial(id: number): Observable<any> {
    return this.http.delete<any>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.materials.delete(id)}`);
  }
}
