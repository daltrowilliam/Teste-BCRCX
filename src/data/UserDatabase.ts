import { BaseDatabase } from "./BaseDatabase";
import { User } from "../business/entities/User";
import { CustomError } from "../business/error/CustomError";

export class UserDatabase extends BaseDatabase {

   private static TABLE_NAME = "bcrcx_users";

   private static toUserModel(user: any): User {
      return user && new User(
         user.id,
         user.username,
         user.password
      );
   }

   public async createUser(
      id: string,
      username: string,
      password: string
   ): Promise<void> {
      try {
         await BaseDatabase.connection
            .insert({
               id,
               username,
               password
            })
            .into(UserDatabase.TABLE_NAME);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }

   public async getUserByUsername(username: string): Promise<User> {
      try {
         const result = await BaseDatabase.connection
            .select("*")
            .from(UserDatabase.TABLE_NAME)
            .where({ username });

         return UserDatabase.toUserModel(result[0]);
      } catch (error) {
         throw new CustomError(500, "An unexpected error ocurred");
      }
   }
}