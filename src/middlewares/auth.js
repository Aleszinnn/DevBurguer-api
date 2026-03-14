import jwt from "jsonwebtoken";
import authConfig from "../config/auth";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // 1. Se não houver cabeçalho, apenas pula para o próximo middleware/rota
    // Isso evita que rotas públicas sejam bloqueadas por erro de token
    if (!authHeader) {
        return next(); 
    }

    // 2. Garante que o token tem o formato "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return next(); // Formato inválido, apenas ignora
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return next(); // Scheme não é Bearer, apenas ignora
    }

    try {
        const decoded = jwt.verify(token, authConfig.secret);

        req.userId = decoded.id;
        req.userAdmin = decoded.admin;

        return next();
    } catch (_err) {
        // Se o token foi enviado mas é INVÁLIDO, aí sim bloqueamos!
        return res.status(401).json({ error: "Token is invalid" });
    }
}

export default authMiddleware;