import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/responsePattern.js";
import { generateHash } from "../config/bcrypt.js"

export async function getUsers(req, res, next) {
    try {

        let page = req.query.page || 1;
        let limit = req.query.limit <= 100 ? req.query.limit : 25;
        let skip = page === 1 ? 0 : (page - 1) * limit

        let users = await userModel.find().skip(skip).limit(limit);

        return res.status(200).json(new ApiResponse(true, users, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function registerUser(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json(new ApiResponse(false, null, "name , password and Email is required"));
        }

        let hash = await generateHash(password);

        const newUser = await userModel.create({ name, email, password: hash });

        return res.status(201).json(new ApiResponse(true, newUser, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function updateUser(req, res, next) {
    try {
        const { userId } = req.params;
        const { name, phone, gender, } = req.body;

        if (!name || !phone || !gender) {
            return res.status(400).json(new ApiResponse(false, null, "name , gender and phone is required"));
        }

        const upUser = await userModel.findByIdAndUpdate(userId, { name, gender, phone }, { returnDocument: "after", runValidators: true });


        if (upUser) return res.status(200).json(new ApiResponse(true, upUser, "success"))

        return res.status(404).json(new ApiResponse(true, null, "User Not Found"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function deleteUser(req, res, next) {
    try {
        const { userId } = req.params;

        const delUser = await userModel.findByIdAndDelete(userId, { returnDocument: "after" });

        if (delUser) return res.status(200).json(new ApiResponse(true, delUser, "deleted success"))

        return res.status(404).json(new ApiResponse(true, null, "User Not Found"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}