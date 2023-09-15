import ItemModel from "../Models/Item.js";

export const uploadFiles = (req, res) => {
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
    const urls = req.files.map((file) => ({
      url: `/item_images/${formattedDate}--${file.originalname}`,
    }));
    res.status(200).json(urls);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

export const create = async (req, res) => {
  try {
    const item = await ItemModel.create({
      user: req.userId,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      sale: req.body.sale,
      quantity: req.body.quantity,
      price: req.body.price,
      rating: req.body.rating,
      reviewsAmount: req.body.reviewsAmount,
      image: req.body.image,
      fields: req.body.fields,
    });
    return res.status(200).json({
      success: true,
      items: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
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
      user: req.userId,
    })
      .then((doc) => {
        if (doc.user !== undefined) {
          res.status(200).json({
            success: true,
          });
        } else {
          res.status(400).json({
            success: false,
            error: "Non user items can`t be deleted",
          });
        }
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

export const searchItem = async (req, res) => {
  try {
    const items = await ItemModel.find({
      $or: [{ name: { $regex: req.params.name, $options: "i" } }],
    });
    if (items) {
      res.status(200).json({
        success: true,
        items: items,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error searching items" });
  }
};

export const updateItemFields = async (req, res) => {
  try {
    // Trying to find item by provided id.
    console.log(req.body.category);

    await ItemModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        sale: req.body.sale,
        quantity: req.body.quantity,
        price: req.body.price,
        rating: req.body.rating,
        reviewsAmount: req.body.reviewsAmount,
        image: req.body.image,
        fields: req.body.fields,
      },
      { new: true }
    ).then((doc) => {
      if (doc) {
        if (doc.user !== undefined) {
          res.status(200).json({
            success: true,
            items: doc,
          });
        } else {
          res.status(400).json({
            success: false,
            error: "Non user items can`t be edited",
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const item = await ItemModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: { quantity: req.body.quantity ? req.body.quantity : 0 },
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
    );

    if (!item) {
      res.status(400).json({
        success: false,
        error: "Item not found",
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
