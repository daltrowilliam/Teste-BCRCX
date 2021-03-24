export class Recipe {
    constructor(
       public readonly id: string,
       public readonly title: string,
       public readonly body: string,
       public readonly tags: [],
       public readonly user: string,
    ) { }
 
 }
 
 export interface RecipeInputDTO {
   title?: string;
   tags?: [];
   body: string;
 }

 
 export interface AuthenticationData {
    id: string;
 }

