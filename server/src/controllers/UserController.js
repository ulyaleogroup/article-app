import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";

let self = {}

self.signup = async (req, res) => {
    try {
        const { email, password, password_confirmation } = req.body;
        if (password !== password_confirmation) {
            return res.status(422).send({
                status: 422,
                message: "password and password_confirmation do not match"
            })
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const user = await User.create({ email: email, password: hashed_password })
        return res.status(201).send({
            status: 201,
            message: "user created successfully",
            data: user
        });
    } catch (error) {
        console.error(`something wrong with this ${error}`);
    }
}

self.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) return res.status(404).send({
            status: 404,
            message: "user not found"
        })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).send({
            status: 401,
            message: "invalid password"
        })
        const access_token = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        const refresh_token = jwt.sign({ id: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
        user.refresh_token = refresh_token
        await user.save()
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        return res.status(200).send({
            status: 200,
            message: "user logged in successfully",
            data: {
                id: user.id,
                email: user.email,
                access_token: access_token
            }
        });
    } catch (error) {
        console.error(`something worng: ${error}`);
    }
}

self.refresh = async (req, res) => {
    try {
        const current_user = await User.findByPk(req.current_user.id)
        if (!current_user) {
            return res.status(404).json({
                status: 404,
                message: "user not found"
            })
        }
        const access_token = jwt.sign({ id: current_user.id, email: current_user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
        return res.status(200).json({
            status: 200,
            message: "generated new access token",
            data: {
                id: current_user.id,
                email: current_user.email,
                access_token: access_token
            }
        })
    } catch (error) {
        console.log(error);
    }
}

self.logout = async (req, res) => {
    try {
        const current_user = await User.findByPk(req.current_user.id)
        if (!current_user) {
            return res.status(404).json({
                status: 404,
                message: "user not found"
            })
        }
        await User.update({ refresh_token: null }, {
            where: {
                id: req.current_user.id
            }
        })
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 200,
            message: "user logged out successfully",
            data: current_user
        })
    } catch (error) {
        console.error(error);
    }
}

self.index = async (req, res) => {
    const users = await User.findAll()
    res.status(200).send({
        status: 200,
        message: "ok",
        data: users
    });
    console.log(req.user);
}

self.show = async (req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    res.status(200).send({
        status: 200,
        message: "ok",
        data: user
    });
}

self.update = async (req, res) => {
    const { id } = req.params
    const { email, password } = req.body
    const user = await User.findByPk(id)
    user.email = email
    user.password = password
    await user.save()
    res.status(200).send({
        status: 200,
        message: `user with id ${id} updated successfully`,
        data: user
    });
}

self.delete = async (req, res) => {
    const { id } = req.params
    const user = await User.findByPk(id)
    await user.destroy()
    res.status(200).send({
        status: 200,
        message: `user with id ${id} deleted successfully`,
        data: user
    });
}

export default self