import SupportTicket from "../models/SupportTicket.js";

export const createTicket = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const t = await SupportTicket.create({
      user: req.user.id,
      subject,
      message,
    });
    res.status(201).json(t);
  } catch (e) {
    next(e);
  }
};

export const myTickets = async (req, res, next) => {
  try {
    const list = await SupportTicket.find({ user: req.user.id });
    res.json(list);
  } catch (e) {
    next(e);
  }
};

export const adminListTickets = async (req, res, next) => {
  try {
    const { status } = req.query; // get status filter from query
    let filter = {};
    if (status && status !== "all") {
      filter.status = status; // apply filter only if not "all"
    }

    const list = await SupportTicket.find(filter).populate("user");
    res.json(list);
  } catch (e) {
    next(e);
  }
};

export const adminAnswerTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminResponse, status } = req.body;
    const updated = await SupportTicket.findByIdAndUpdate(
      id,
      { adminResponse, status: status || "answered" },
      { new: true }
    );
    res.json(updated);
  } catch (e) {
    next(e);
  }
};
