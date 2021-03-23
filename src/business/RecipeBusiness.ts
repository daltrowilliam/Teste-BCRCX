import { AuthenticationData, RecipeInputDTO } from "./entities/Recipe";
import { RecipeDatabase } from "../data/RecipeDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class RecipeBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator,
      private recipeDatabase: RecipeDatabase,
   ) { }

   async registryRecipe(recipe: RecipeInputDTO, authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

            
      if (
         !recipe.title ||
         !recipe.body
     ) {
      throw new CustomError(400, "'title' and 'body' must be informed!");
     }

      const id = this.idGenerator.generate();

      const user = tokenData.id

      await this.recipeDatabase.registryRecipe(
         id,
         recipe.title,
         recipe.body,
         user
      );

      return "Registry Done!";
   }

   async getRecipeById(id: string, authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

      const recipe = await this.recipeDatabase.getRecipeById(id);

      if (!recipe) {
         throw new CustomError(404, "Recipe Not Found!");
      }

      return recipe;
   }

   async deleteRecipeById(id: string, authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

      const recipe = await this.recipeDatabase.getRecipeById(id);

      if (!recipe) {
         throw new CustomError(404, "Recipe Not Found!");
      }

      await this.recipeDatabase.deleteRecipeById(id);

   }


   async alterRecipe(id: string, recipe: RecipeInputDTO, authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

      const recipeFromDB = await this.recipeDatabase.getRecipeById(id);

      if (!recipeFromDB) {
         throw new CustomError(404, "Recipe Not Found!");
      }
            
      if (
         !recipe.body
     ) {
      throw new CustomError(400, "'body' must be informed!");
     }


      await this.recipeDatabase.alterRecipe(
         id,
         recipe.body,
      );

      return "Recipe Altered!";
   }

   async getAllRecipes(authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

      const recipes = await this.recipeDatabase.getAllRecipes();

      if (!recipes) {
         throw new CustomError(404, "Recipe Not Found!");
      }

      return recipes;
   }

}