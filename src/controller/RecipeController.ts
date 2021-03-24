import { Request, Response } from "express";
import { RecipeInputDTO } from "../business/entities/Recipe";
import { Authenticator } from "../business/services/Authenticator";
import { HashManager } from "../business/services/HashManager";
import { IdGenerator } from "../business/services/IdGenerator";
import { RecipeBusiness } from "../business/RecipeBusiness";
import { RecipeDatabase } from "../data/RecipeDatabase";

const recipeBusiness = new RecipeBusiness(
   new IdGenerator(),
   new HashManager,
   new Authenticator(),
   new RecipeDatabase()
);

export class RecipeController {
   async registryRecipe(req: Request, res: Response) {
      try {

         const { authorization } = req.headers

         const input: RecipeInputDTO = {
            title: req.body.title,
            tags: req.body.tags,
            body: req.body.body
         }

         const registry = await recipeBusiness.registryRecipe(input, authorization);

         res.status(200).send({ registry });

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }

   async alterRecipe(req: Request, res: Response) {
      try {

         const { authorization } = req.headers

         const id = req.params.id;

         const input: RecipeInputDTO = {
            body: req.body.body,
            tags: req.body.tags
         }

         const message = await recipeBusiness.alterRecipe(id, input, authorization);

         res.status(200).send({ message });

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }


   async getRecipeById(req: Request, res: Response) {

      const { authorization } = req.headers

      try {

         const id = req.params.id;

         const recipe = await recipeBusiness.getRecipeById(id, authorization);

         res.status(200).send({ recipe });

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }

   async getRecipeByTags(req: Request, res: Response) {

      const { authorization } = req.headers

      try {

         const tag = req.query.tag as string;
         console.log("TAG:", tag)

         const recipe = await recipeBusiness.getRecipeByTags(tag, authorization);

         res.status(200).send({ recipe });

      } catch (error) {
         res
            .status(error.statusCode || 400)
            .send({ error: error.message });
      }
   }



async getAllRecipes(req: Request, res: Response) {

   const { authorization } = req.headers

   try {

      const recipes = await recipeBusiness.getAllRecipes(authorization);

      res.status(200).send({ recipes });

   } catch (error) {
      res
         .status(error.statusCode || 400)
         .send({ error: error.message });
   }
}

async deleteRecipeById(req: Request, res: Response) {

   const { authorization } = req.headers

   try {

      const id = req.params.id;

      await recipeBusiness.deleteRecipeById(id, authorization);

      res.status(200).send("Recipe deleted!");

   } catch (error) {
      res
         .status(error.statusCode || 400)
         .send({ error: error.message });
   }
}

}
