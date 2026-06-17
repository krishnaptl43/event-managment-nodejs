import eventModel from "../models/eventModel.js";
import { ApiResponse } from "../utils/responsePattern.js";

export async function getEvents(req, res, next) {
    try {

        let page = req.query.page || 1;
        let limit = req.query.limit <= 15 ? req.query.limit : 8;
        let skip = page === 1 ? 0 : (page - 1) * limit

        let events = await eventModel.find().skip(skip).limit(limit);

        return res.status(200).json(new ApiResponse(true, events, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function addEvent(req, res, next) {
    try {
        const {
            title,
            desc,
            total_general_tickets,
            total_premium_tickets,
            general_tickets_price,
            premium_tickets_price,
            date,
            time,
            venue,
            category,
            highlights,
            organizer
        } = req.body;

        if (
            !title
            || !desc
            || !total_general_tickets
            || !total_premium_tickets
            || !general_tickets_price
            || !premium_tickets_price
            || !date
            || !time
            || !venue
            || !category
            || !organizer) {
            return res.status(400).json(new ApiResponse(false, null, "All Fields Are required"));
        }


        const newEvent = await eventModel.create({
            title,
            desc,
            total_general_tickets,
            total_premium_tickets,
            general_tickets_price,
            premium_tickets_price,
            date,
            time,
            venue,
            category,
            highlights,
            organizer,
            images : [],
            thumbnail : ""
        });

        return res.status(201).json(new ApiResponse(true, newEvent, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function updateEvent(req, res, next) {
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

export async function deleteEvent(req, res, next) {
    try {
        const { eventId } = req.params;

        const delEvent = await eventModel.findByIdAndDelete(eventId, { returnDocument: "after" });

        if (delEvent) return res.status(200).json(new ApiResponse(true, delEvent, "deleted success"))

        return res.status(404).json(new ApiResponse(true, null, "Event Not Found"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function cancelEvent(req, res, next) {
    try {
        const { eventId } = req.params;

        const cancelEvent = await eventModel.findByIdAndUpdate(eventId, { isCancel: true }, { returnDocument: "after" });

        if (cancelEvent) return res.status(200).json(new ApiResponse(true, cancelEvent, "cencel success"))

        return res.status(404).json(new ApiResponse(true, null, "Event Not Found"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}