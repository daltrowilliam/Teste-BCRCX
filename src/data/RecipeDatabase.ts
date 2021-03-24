import { BaseDatabase } from "./BaseDatabase";
import { Recipe } from "../business/entities/Recipe";
import { CustomError } from "../business/error/CustomError";

export class RecipeDatabase extends BaseDatabase {

   private static TABLE_NAME = "bcrcx_recipes";

   private static toRecipeModel(recipe: any): Recipe {
      return recipe && new Recipe(
         recipe.id,
         recipe.title,
         recipe.body,
         recipe.tags,
         recipe.user
      );
   }


   public async registryRecipe(
      id: string,
      title: string,
      body: string,
      tags: [],
      user_id: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               title,
               body,
               tags,
               user_id
            })
            .into(RecipeDatabase.TABLE_NAME);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async alterRecipe(
      id: string,
      body: string,
      tags: []
   ): Promise<void> {
      try {
         const result = await BaseDatabase.connection.raw(`
            UPDATE ${RecipeDatabase.TABLE_NAME}
            SET body = '${body}', tags = '${tags}'
            WHERE id = '${id}';
         `)
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
         console.log("Mensagem de Erro:", error)
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async getRecipeByTag(tag: string): Promise<Recipe> {
      try {
         const result = await BaseDatabase.connection.raw(`
            SELECT * FROM ${RecipeDatabase.TABLE_NAME}
            WHERE tags LIKE '%${tag}%';
         `)

         return RecipeDatabase.toRecipeModel(result[0][0]);

      } catch (error) {
         throw new CustomError(500, "Função errada An unexpected error ocurred");
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