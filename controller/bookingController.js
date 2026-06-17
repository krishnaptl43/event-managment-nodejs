import bookingModel from "../models/bookingModel.js";
import eventModel from "../models/eventModel.js";
import { ApiResponse } from "../utils/responsePattern.js";

export async function getAllBookings(req, res, next) {
    try {

        let page = req.query.page || 1;
        let limit = req.query.limit <= 100 ? req.query.limit : 25;
        let skip = page === 1 ? 0 : (page - 1) * limit

        let bookings = await bookingModel.find().skip(skip).limit(limit);

        return res.status(200).json(new ApiResponse(true, bookings, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function getMyBookings(req, res, next) {
    try {

        let page = req.query.page || 1;
        let limit = req.query.limit <= 15 ? req.query.limit : 8;
        let skip = page === 1 ? 0 : (page - 1) * limit

        let booking = await bookingModel.find({ attendee: req.user._id }).skip(skip).limit(limit);

        return res.status(200).json(new ApiResponse(true, booking, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function bookTicket(req, res, next) {
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

export async function cancelBooking(req, res, next) {
    try {
        const { bookingId } = req.params;

        const cancelBooking = await bookingModel.findOneAndUpdate({ _id: bookingId, attendee: req.user._id }, { isCancel: true }, { returnDocument: "after" });

        if (cancelBooking) return res.status(200).json(new ApiResponse(true, cancelBooking, "cencel success"))

        return res.status(404).json(new ApiResponse(true, null, "Event Not Found"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}