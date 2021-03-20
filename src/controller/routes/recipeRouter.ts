import express from "express";
import { RecipeController } from "../RecipeController";


export const recipeRouter = express.Router();

const recipeController = new RecipeController();

recipeRouter.post("/registry", recipeController.registryRecipe);
recipeRouter.put("/alter", recipeController.alterRecipe);
recipeRouter.delete("/delete/:id", recipeController.deleteRecipeById);
recipeRouter.get("/", recipeController.getAllRecipes);
recipeRouter.get("/:id", recipeController.getRecipeById);
