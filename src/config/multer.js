import multer from "multer";
import { v4 } from "uuid";
import { extname, resolve } from "node:path";

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, "..", "..", "uploads"),
        // Alterado de 'req' para '_req' para resolver o erro de parâmetro não utilizado do Biome
        filename: (_req, file, callback) =>
            callback(null, v4() + extname(file.originalname)),
    }),
};