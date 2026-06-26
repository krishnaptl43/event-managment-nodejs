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

        let booking = await bookingModel.find({ attendee: req.user._id })
            .skip(skip)
            .limit(limit)
            .populate("attendee")
            .populate("event");

        return res.status(200).json(new ApiResponse(true, booking, "success"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "Internal server Error"))
    }
}

export async function bookTicket(req, res, next) {
    try {
        const { event, booked_tickets, ticket_type } = req.body;

        if (!event || !ticket_type) {
            return res.status(400).json(new ApiResponse(false, null, "Event And ticket_type (general or premium)  is required"));
        }

        const eventDetail = await eventModel.findOne({ _id: event, isCancel: false, isExpire: false });

        if (!eventDetail) {
            return res.status(400).json(new ApiResponse(false, null, "Event Not Found or cancelled"));
        }

        let eventDate = new Date(eventDetail.date);
        let today = Date.now();

        // book before one days ago
        if (!(eventDate.getTime() - (1000 * 60 * 60 * 24) > today)) {
            return res.status(400).json(new ApiResponse(false, null, "you are too late to book tickets"));
        }

        let total_ticket_amount = ticket_type === "general"
            ? eventDetail.general_tickets_price * (Number(booked_tickets) || 1)
            : eventDetail.premium_tickets_price * (Number(booked_tickets) || 1)

        const ticket = await bookingModel.create({
            attendee : req.user._id,
            event,
            booked_tickets: Number(booked_tickets) || 1,
            ticket_type,
            total_ticket_amount
        });

        return res.status(201).json(new ApiResponse(true, ticket, "ticket booked success"))

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