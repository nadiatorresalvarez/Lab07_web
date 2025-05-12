//importa todo lo exportado desde 'authJwt.js' como un objeto llamado 'authJwt'
//esto incluye funciones como verifyToken, isAdmin, isModerator, etc., si estane exportadas desde ese archivo
import * as authJwt from "./authJwt.js";

//importa directamente la función las funciones 'checkDuplicateUsernameorEmail' y 'checkRolesExisted'
//desde el archivo 'verifySignUp.js', estas funciones probablemente validan datos del usuario durante el registro
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "./verifySignUp.js";

export { authJwt, checkDuplicateUsernameOrEmail, checkRolesExisted };