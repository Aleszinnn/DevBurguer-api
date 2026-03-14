import jwt from "jsonwebtoken";
import * as Yup from "yup";
import User from "../models/User";
import bcrypt from "bcryptjs";
import authConfig from "../../config/auth"

class SessionController {
	async store(request, response) {
		const Schema = Yup.object({
			email: Yup.string().email().required(),
			password: Yup.string().min(6).required(),
		});

		const isValid = await Schema.isValid(request.body, {
			abortEarly: false,
			strict: true
		});

		const emailOrPasswordIncorrect = () => {
			return response
				.status(401)
				.json({ error: "Make sure your email and password are correct" });
		}

		if (!isValid) {
			return emailOrPasswordIncorrect();
		}

		const { email, password } = request.body;

		const existingUser = await User.findOne({
			where: {
				email,
			},
		});

		if (!existingUser) {
			return emailOrPasswordIncorrect();
		}

		const isPasswordCorrect = await bcrypt.compare(password, existingUser.password_hash);

		if (!isPasswordCorrect) {
			return emailOrPasswordIncorrect();
		}

		const token = jwt.sign( { id: existingUser.id, admin: existingUser.admin }, authConfig.secret, {expiresIn: authConfig.expiresIn})

		return response.status(201).json({
			id: existingUser.id,
			name: existingUser.name,
			email: existingUser.email,
			admin: existingUser.admin,
			token
			});
	}
}

export default new SessionController();