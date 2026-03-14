import { v4 } from "uuid";

import * as Yup from "yup";

import User from "../models/User";

class userController {
	async store(req, res) {
		const schema = Yup.object({
			name: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().required(),
			admin: Yup.boolean().required(),
		});
		try {
			schema.validateSync(req.body, { abortEarly: false });
		} catch (err) {
			return res.status(400).json({ error: err.errors });
		}

		const { name, email, password, admin } = req.body;

		const userExists = await User.findOne({
			where: {
				email: req.body.email,
			},
		});

		if (userExists) {
			return res.status(400).json({ error: "User already exists" });
		}

		const user = await User.create({
			id: v4(),
			name,
			email,
			password,
			admin,
		});

		return res.status(201).json({
			id: user.id,
			name: user.name,
			email: user.email,
			admin: user.admin,
		});
	}
}

export default new userController();