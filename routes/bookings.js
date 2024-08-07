const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { validateBooking, Booking } = require("../models/booking");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const service = require("../services/booking");
const userService = require("../services/user");
const validator = require("../middlewares/validate");

router.post('/', [auth, validator(validateBooking)], async (req, res) => {
    const booking = new Booking({ ...req.body, booker: req.user._id });

    await booking.save();

    res.send(await service.findById(booking._id));

    const booker = await userService.findById(req.user._id);
    const car = req.body.car;
    const bookedCars = { ...(booker.bookedCars || {}), [car]: car };
    userService.findByIdAndUpdate(booker._id, { bookedCars });
});

router.get('/', [auth, admin], async (_req, res) => {
    const bookings = await service.getAll();

    res.send(bookings);
});

router.get('/my', auth, async (req, res) => {
    const myBookings = await service.getAll({ booker: req.user._id });

    res.send(myBookings);
});

router.get('/:id', auth, async (req, res) => {
    const bookingId = req.params.id;
    if (!mongoose.isValidObjectId(bookingId))
        return res.status(400).send({ error: 'Invalid booking id' })

    const booking = await service.findById(bookingId);
    if (!booking) return res
        .status(404)
        .send({ error: 'The booking with the given id does not exist' })

    const user = await userService.findById(req.user._id);
    if (!user) return res
        .status(400)
        .send({ error: "You don't exist in the database" });

    const isAuthorised =
        user._id.toString() === booking.booker._id.toString()
        || user.isAdmin;

    (isAuthorised)
        ? res.send(booking)
        : res.status(403).send({ error: "You're not authorised for this booking info" });
});

module.exports = router;