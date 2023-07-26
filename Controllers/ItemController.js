import ItemModel from "../Models/Item.js";

export const create = async (req, res) => {
  // Trying to create new item and if successful, save it to database.
  try {
    const item = await new ItemModel({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      sale: req.body.sale,
      price: req.body.price,
      rating: req.body.rating,
      reviewsAmount: req.body.reviewsAmount,
      image: req.body.image,
    }).save();

    return res.status(200).json({
      success: true,
      items: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // Finding all items.
    const items = await ItemModel.find();

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // Trying to find item by provided id.
    const item = await ItemModel.findById(req.params.id);

    if (!item) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        success: true,
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
export const getOneCategory = async (req, res) => {
  try {
    // Trying to find item by provided category.
    const category = req.params.category;
    const item = await ItemModel.find({ category: { $eq: category } });

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

export const remove = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await ItemModel.findOneAndDelete({
      _id: req.params.id,
    })
      .then(() => {
        res.status(200).json({
          success: true,
        });
      })
      .catch(() => {
        res.status(404).json({
          success: false,
          error: "Not found",
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await ItemModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        sale: req.body.sale,
        price: req.body.price,
        rating: req.body.rating,
        reviewsAmount: req.body.reviewsAmount,
        image: req.body.image,
      },
      { new: true }
    ).then((doc) => {
      if (!doc) {
        res.status(400).json({
          success: false,
          error: "Item not found",
        });
      } else {
        res.status(200).json({
          success: true,
          item: doc,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
