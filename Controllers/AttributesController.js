import Attributes from "../Models/Attribute.js";

export const create = async (req, res) => {
  try {
    const attribute = await Attributes.create(req.body);
    res.status(201).json(attribute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAttributesByCategory = async (req, res) => {
  try {
    // Trying to find item by provided category.
    const category = req.params.category;
    const item = await Attributes.find({ category: { $eq: category } });
    console.log(item)
    if (!item) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        items: item,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const attribute = await Attributes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const attribute = await Attributes.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res.status(404).json({ error: "Attribute not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
