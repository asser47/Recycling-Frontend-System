export interface Factory {
  id: number;
  name: string;
  location: string;
}

export interface CreateFactoryDto {
  name: string;
  location: string;
}

export interface UpdateFactoryDto {
  id: number;
  name: string;
  location: string;
}
