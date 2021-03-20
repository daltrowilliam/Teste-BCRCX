export class Recipe {
    constructor(
       public readonly id: string,
       public readonly title: string,
       public readonly body: string,
       public readonly user: [],
    ) { }
 
 }
 
 export interface RecipeInputDTO {
   title: string;
   body: string
 }
 
 export interface AuthenticationData {
    id: string;
 }

