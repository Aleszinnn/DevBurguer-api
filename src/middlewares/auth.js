import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

function authMiddleware(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return req.status(401).json({error: 'Token not provider'}); 
    }

    const token = authToken.split(' ')[1];

    try {
        const decoded = 
        jwt.verify(token, authConfig.secret, (error, decoded) => {
            if (error) {
                throw Error();
            }
            console.log(decoded);
            req.userId = decoded.id;
            req.adminIsAdmin = decoded.admin;
        })

    } catch (_err) {
        // Se o token foi enviado mas é INVÁLIDO, aí sim bloqueamos!
        return res.status(401).json({ error: "Token is invalid" });
    }
    
    return next();
}

export default authMiddleware;