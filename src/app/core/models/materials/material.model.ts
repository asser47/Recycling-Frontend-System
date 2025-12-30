export interface Material {
  id: number;
  typeName: string;
  size: string;
  price: number;
}

export interface MaterialDto {
  id: number;
  typeName: string;
  size?: number;
  price: number;
}
