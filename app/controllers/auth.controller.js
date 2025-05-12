import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import authConfig from "../config/auth.config.js";

const { user: User, role: Role } = db;

export const signup = async (req, res) => {
    try {
        // extrae los datos enviados en la solicitud
        const { username, email, password, roles } = req.body;

        //encripta la contraseña utilizando bcrypt
        const hashedPassword = await bcrypt.hashSync(password, 8);

        //busca el rol 'user' en la base de datos para asginarlo por defecto
        const userRole = await Role.findOne({ where: { name: "user" } });

        //crea un nuevo usuario en la base de datos con los datos proporcionadosy la constraseña encriptada
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        await user.setRoles([userRole.id]); // Asigna el rol de usuario por defecto

        // devuelve respuesta exitosa con el usuario creado
        res.status(201).json({ message: "Usuario registrado exitosamente!" });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        // extrae los datos enviados en la solicitud
        const { username, password } = req.body;

        //busca el usuario en la base de datos utilizando el nombre de usuario proporcionado
        const user = await User.findOne({
            where: { username },
            include: [{ model: Role, as: "roles" }],
        });

        //si no se encuentra el usuario, responde con un error 404 (No encontrado)
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado!" });
        }

        //compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const passwordIsValid = await bcrypt.compare(password, user.password);

        //si la contraseña es incorrecta, responde con un error 401 (No autorizado)
        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: "Contraseña incorrecta!" });
        }

        //si la contraseña es correcta, genera un token JWT para el usuario que expira en 24 hrs
        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400, // 24 horas
        });

        //crea un array con los roles del usuario en el formato 'ROLE_ADMIN', 'ROLE_USER', etc.
        const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

        //responde con la informacion del usuario y el token de acceso
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        res.status(500).json({ message: error.message });
    }
};