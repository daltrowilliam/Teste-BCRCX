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
         !user.name ||
         !user.email ||
         !user.password ||
         !user.nickname
     ) {
      throw new CustomError(400, "'name', 'email', 'password' and 'nickname', must be informed!");
     }

     if (user.password.length < 6) {
         throw new CustomError(400, "Your password must have 6 characters at least")
     }

     if (user.email.indexOf("@") === -1) {
         throw new CustomError(400, "Invalid email")
     }

     
      const userFromDB = await this.userDatabase.getUserByEmail(user.email);

      if (userFromDB) {
         throw new CustomError(400, "Email already exist!");
      }

      const id = this.idGenerator.generate();

      const hashPassword = await this.hashManager.hash(user.password);

      await this.userDatabase.createUser(
         id,
         user.email,
         user.name,
         user.nickname,
         hashPassword
      );

      const accessToken = this.authenticator.generateToken({
         id
      });

      return accessToken;
   }

   async login(user: LoginInputDTO) {


      if (!user.email || !user.password) {
         throw new CustomError(400, "'email' and 'password' must be informed!");
      }

      const userFromDB = await this.userDatabase.getUserByEmail(user.email);

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

      const username = userFromDB.name

      return {accessToken, username};
   }
}