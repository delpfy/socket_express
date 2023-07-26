import ReviewModel from "../Models/Review.js";

export const create = async (req, res) => {
  console.log("HEY " + req.body.disadvantages);
  try {
    const review = await new ReviewModel({
      item: req.body.item,
      user: req.userId,
      userName: req.body.userName,
      description: req.body.description,
      rating: req.body.rating,
      advantages: req.body.advantages,
      disadvantages: req.body.disadvantages,
      replies: req.body.replies,
    }).save();

    return res.status(200).json({
      success: true,
      review: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getItemReviews = async (req, res) => {
  try {
    // Trying to find item by id.
    const reviews = await ReviewModel.find({
      item: { $eq: req.params.itemId },
    });

    if (!reviews) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        reviews: reviews,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    // Trying to find item by id.
    const reviews = await ReviewModel.find({
      user: { $eq: req.userId },
    });

    if (!reviews) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        reviews: reviews,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const removeItemReview = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await ReviewModel.findOneAndDelete({
      _id: req.params.reviewId,
    })
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            success: true,
          });
        } else {
          res.status(404).json({
            success: false,
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

export const updateItemReview = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await ReviewModel.findOneAndUpdate(
      {
        _id: req.params.reviewId,
      },
      {
        description: req.body.description,
        rating: req.body.rating,
        advantages: req.body.advantages,
        disadvantages: req.body.disadvantages,
        replies: req.body.replies,
      },
      { new: true }
    ).then((doc) => {
      if (!doc) {
        res.status(400).json({
          success: false,
          error: "Review not found",
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

export const updateAllUserReviews = async (req, res) => {
  try {
    // Trying to find item by provided id.
    await ReviewModel.updateMany(
      {
        user: { $eq: req.userId },
      },
      {
        userName: req.body.userName,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
