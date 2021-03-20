import { CustomError } from "../error/CustomError";

export class User {
   constructor(
      public readonly id: string,
      public readonly username: string,
      public readonly password: string
   ) { }
}

export interface UserInputDTO {
   username: string;
   password: string;
}

// Verificar se tem utilidade
export interface LoginInputDTO {
   username: string;
   password: string;
}

export interface AuthenticationData {
   id: string;
}