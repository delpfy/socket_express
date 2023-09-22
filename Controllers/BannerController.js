import Banners from "../Models/Banner.js";

export const create = async (req, res) => {
  try {
    const banner = new Banners(req.body);
    await banner.save();
    res.status(201).send(banner);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const update = async (req, res) => {
  try {
    const banner = await Banners.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) {
      return res.status(404).send("Banner not found");
    }
    res.send(banner);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const remove = async (req, res) => {
  try {
    const banner = await Banners.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).send("Banner not found");
    }
    res.send(banner);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getOne = async (req, res) => {
  try {
    const banner = await Banners.findById(req.params.id);
    if (!banner) {
      return res.status(404).send("Banner not found");
    }
    res.send(banner);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAll = async (req, res) => {
  try {
    const banners = await Banners.find();
    res.send(banners);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const uploadImage = (req, res) => {
  const formattedDate = new Date()
    .toLocaleString("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\D+/g, "_");
  try {
    res.status(200).json({
      url: `/banner_images/${formattedDate}--${req.file.originalname}`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};
