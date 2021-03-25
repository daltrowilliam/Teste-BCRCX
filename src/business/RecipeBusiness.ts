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
         !recipe.tags ||
         !recipe.body
     ) {
      throw new CustomError(400, "'title', 'body' and 'tags' must be informed!");
     }

      const id = this.idGenerator.generate();

      const user = tokenData.id

      await this.recipeDatabase.registryRecipe(
         id,
         recipe.title,
         recipe.body,
         recipe.tags,
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

   async getRecipeByTags(tag: any, authorization: string | undefined) {

      const tokenData: AuthenticationData = this.authenticator.getData(authorization!)

      if (!tokenData) {
         throw new CustomError(403, "Invalid Token")
      }

      console.log(tag)

      const recipe = await this.recipeDatabase.getRecipeByTag(tag);

      console.log(recipe)

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
         !recipe.body && !recipe.tags
     ) {
      throw new CustomError(400, "'body' OR ´tags´ must be informed!");
     }

      let body = recipeFromDB.body
      let tags = recipeFromDB.tags

      if (recipe.body) {
         body = recipe.body
      }

      if (recipe.tags) {
         tags = recipe.tags
      }

      await this.recipeDatabase.alterRecipe(
         id,
         body,
         tags
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