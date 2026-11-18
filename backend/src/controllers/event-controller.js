import mongoose from "mongoose";
import Event from "../models/event.js";

// GET /events (?category=Atölye isteğe bağlı)
export async function getEvents(req, res) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}

// GET /events/:id
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    // Geçersiz ID kontrolü (Invalid ObjectId -> 404)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }

    const event = await Event.findById(id);

    // Olmayan ID kontrolü (Valid ObjectId but not found -> 404)
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }

    res.json(event);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    res.status(500).json({ error: { message: err.message } });
  }
}

// POST /events
export async function createEvent(req, res) {
  try {
    const { title, category, capacity, date, time, location, description, image } = req.body ?? {};

    // Eksik veri kontrolü (400 Bad Request)
    if (!title || !category || !date) {
      return res.status(400).json({
        error: { message: "title, category and date are required" },
      });
    }

    const newEvent = await Event.create({
      title,
      category,
      date,
      capacity: capacity !== undefined ? Number(capacity) : 0,
      time: time ?? "",
      location: location ?? "",
      description: description ?? "",
      image: image ?? "",
    });

    res.status(201).json(newEvent);
  } catch (err) {
    // Mongoose doğrulama hataları sunucuyu çökertmeden 400 döner
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({
        error: { message: err.message },
      });
    }
    res.status(500).json({
      error: { message: err.message || "Internal server error" },
    });
  }
}
