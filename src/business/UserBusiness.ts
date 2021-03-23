import { UserInputDTO, LoginInputDTO } from "./entities/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { HashManager } from "./services/HashManager";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

   constructor(
      private idGenerator: IdGenerator,
      private hashManager: HashManager,
      private authenticator: Authenticator,
      private userDatabase: UserDatabase,
   ) { }

   async createUser(user: UserInputDTO) {
           
      if (
         !user.username ||
         !user.password
     ) {
      throw new CustomError(400, "'name', and 'password', must be informed!");
     }

     if (user.password.length < 6) {
         throw new CustomError(400, "Your password must have 6 characters at least")
     }
     
      const userFromDB = await this.userDatabase.getUserByUsername(user.username);

      if (userFromDB) {
         throw new CustomError(400, "username already exist!");
      }
 
      const id = this.idGenerator.generate();

      const hashPassword = await this.hashManager.hash(user.password);

      await this.userDatabase.createUser(
         id,
         user.username,
         hashPassword
      );

      const accessToken = this.authenticator.generateToken({
         id
      });

      return accessToken;
   }

   async login(user: LoginInputDTO) {


      if (!user.username || !user.password) {
         throw new CustomError(400, "'username' and 'password' must be informed!");
      }

      const userFromDB = await this.userDatabase.getUserByUsername(user.username);

      if (!userFromDB) {
         throw new CustomError(404, "User Not Found!");
      }

      const passwordIsCorrect = await this.hashManager.compare(
         user.password,
         userFromDB.password
      );

      if (!passwordIsCorrect) {
         throw new CustomError(401, "Invalid credentials!");
      }

      const accessToken = this.authenticator.generateToken({
         id: userFromDB.id
      });

      return accessToken;
   }
}