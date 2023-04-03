import BasketItemModel from "../Models/BasketItem.js";


export const create = async (req, res) => {
  

  try {
    // Trying to find item by provided name and if found increment 
    // its amount value, istead of creating a new one.

    await BasketItemModel.findOneAndUpdate(
      { name: req.body.name },
      { $inc: { amount: 1 } }, // Increment
      { new: false, upsert: false }
    )
      .then(async (doc) => {

        // If not found, create new item and add to database.
        if (!doc) {
          const item = await new BasketItemModel({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            rating: req.body.rating,
            image: req.body.image,
            amount: req.body.amount,
            user: req.userId,
          }).save();

          return res.status(200).json({
            success: true,
            items: item,
          });
        } else {
          return res.status(200).json({
            success: true,
            doc: doc,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          error: error,
        });
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
    // Trying to get all items, 
    // populate("user").exec() - to display full user info, insted of token.
    const items = await BasketItemModel.find().populate("user").exec();

    res.status(200).json({
      success: true,
      items: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      items: error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // Trying to get one item by id.
    const item = await BasketItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
    return res.status(200).json({
      success: true,
      items: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    // Trying to find item by provided id and if found decrement 
    // its amount value, istead of removing full item.
    await BasketItemModel.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { amount: -1 } }, // Decrement
      { new: false, upsert: false }
    )
      .then(async (doc) => {

        // If amount is 0 or lower - remove item from database.
        if (doc.amount - 1 <= 0) {
          await BasketItemModel.findOneAndDelete({ _id: req.params.id })
            .then(() => {
              return res.status(200).json({
                success: true,
              });
            })
            .catch(() => {
              return res.status(404).json({
                success: false,
                error: "Not found",
              });
            });
        } else {
          return res.status(200).json({
            success: true,
            doc: doc,
          });
        }
      })
      .catch((error) => {
        return res.status(404).json({
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
