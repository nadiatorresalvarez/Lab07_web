import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import authConfig from '../config/auth.config.js';

const {user: User, role: Role} = db;

export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        return res.status(403).json({message: 'No proporciono un token!'});
    }

    try{
        //verificamos y codificamos el token, eliminando el prefijo 'Bearer ' si existe
        const decoded = jwt.verify(token.startsWith("Bearer ", ""), authConfig.secret);

        //almacenamos el id del usuario decodificado en la solicitud para su uso posterior
        req.userId = decoded.id;
        //buscamos el usuario en la base de datos utilizando el id
        const user = await User.findByPk(req.userId);

        //si no se encuentra el usuario, respondemos con un error 401 (No autorizado)
        if (!user) {
            return res.status(401).json({message: 'No autorizado!'});
        }
        //si todo es correcto, pasamos al siguiente middleware
        next();
    } catch (error) {
        //si hay un error en la verificación del token, respondemos con un error 401 (No autorizado)
        return res.status(401).json({message: 'No autorizado!'});
    }
};

/* 
* Middleware para verificar si el usuario tiene un rol de admin
*/
export const isAdmin = async (req, res, next) => {
    try {
        //buscamos el usuario en la base de datos utilizando el id almacenado en la solicitud
        const user = await User.findByPk(req.userId, {include: [{model: Role, as: 'roles'}]});

        //obtenemos los roles asociados al usuario
        const roles = await user.getRoles();
        //verificamos si el usuario tiene el rol de admin
        const adminRole = roles.find((role) => role.name === "admin");

        //si el usuario tiene el rol de admin, pasamos al siguiente middleware
        if (adminRole) {
            next();
            return;
        }

        //si el usuario no tiene el rol de admin, respondemos con un error 403 (Prohibido)
        return res.status(403).json({message: 'Requiere el rol de Administrador!'});
    } catch (error) {
        //si hay un error al buscar el usuario, respondemos con un error 500 (Error interno del servidor)
        return res.status(500).json({message: error.message});
    }
};
/* 
* Middleware para verificar si el usuario tiene un rol de 'moderator'
*/
export const isModerator = async (req, res, next) => {
    try {
        //buscamos el usuario en la base de datos utilizando el id almacenado en la solicitud
        const user = await User.findByPk(req.userId);

        //obtenemos los roles asociados al usuario
        const roles = await user.getRoles();
        //verificamos si el usuario tiene el rol de moderator
        const moderatorRole = roles.find((role) => role.name === "moderator");

        //si el usuario tiene el rol de moderator, pasamos al siguiente middleware
        if (moderatorRole) {
            next();
            return;
        }

        //si el usuario no tiene el rol de moderator, respondemos con un error 403 (Prohibido)
        return res.status(403).json({message: 'Requiere el rol de Moderador!'});
    } catch (error) {
        //si hay un error al buscar el usuario, respondemos con un error 500 (Error interno del servidor)
        return res.status(500).json({message: error.message});
    }
};

/* 
* Middleware para verificar si el usuario tiene un rol de 'admin' o 'moderator'
*/
export const isAdminOrModerator = async (req, res, next) => {
    try {
        //buscamos el usuario en la base de datos utilizando el id almacenado en la solicitud
        const user = await User.findByPk(req.userId);

        //obtenemos los roles asociados al usuario
        const roles = await user.getRoles();
        //verificamos si el usuario tiene el rol de admin o moderator
        const hasRole = roles.some((role) => ["admin", "moderator"].includes(role.name));
        //si el usuario tiene el rol de admin o moderator, pasamos al siguiente middleware
        if (hasRole) {
            next();
            return;
        }

        //si el usuario no tiene el rol de admin o moderator, respondemos con un error 403 (Prohibido)
        res.status(403).json({message: 'Requiere el rol de Administrador o Moderador!'});
    } catch (error) {
        //si hay un error al buscar el usuario, respondemos con un error 500 (Error interno del servidor)
        return res.status(500).json({message: error.message});
    }
};