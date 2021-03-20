import { BaseDatabase } from "./BaseDatabase";
import { Recipe } from "../business/entities/Recipe";
import { CustomError } from "../business/error/CustomError";

export class RecipeDatabase extends BaseDatabase {

   //Alterar o nome da tabela
   private static TABLE_NAME = "kordasights_images";

   private static toRecipeModel(recipe: any): Recipe {
      return new Recipe(
         recipe.id,
         recipe.title,
         recipe.body,
         recipe.user
      );
   }


   public async registryRecipe(
      id: string,
      title: string,
      body: string,
      user: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               title,
               body,
               user
            })
            .into(RecipeDatabase.TABLE_NAME);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }



   public async getRecipeById(id: string): Promise<Recipe> {
      try {
         const result = await BaseDatabase.connection.raw(`
            SELECT * FROM ${RecipeDatabase.TABLE_NAME}
            WHERE id = '${id}';
         `)

         return RecipeDatabase.toRecipeModel(result[0][0]);

      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async getAllRecipes(): Promise<Recipe> {
      try {
         
         const result = await BaseDatabase.connection.raw(`
            SELECT * FROM ${RecipeDatabase.TABLE_NAME};
         `)

         return result[0];

      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async deleteRecipeById(id: string): Promise<any> {
      try {
         await BaseDatabase.connection.raw(`
            DELETE FROM ${RecipeDatabase.TABLE_NAME}
            WHERE id = '${id}';
         `)

      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }
}