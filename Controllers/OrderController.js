import OrderModel from "../Models/Order.js";

export const create = async (req, res) => {
  // Trying to create new order and if successful, save it to database.
  try {
    const order = await new OrderModel({
      user_location: req.body.user_location,
      receiver: req.body.receiver,
      user_contact: req.body.user_contact,
      delivery: req.body.delivery,
      payment: req.body.payment,
      payWithParts: req.body.payWithParts,
      items: req.body.items,
      total: req.body.total,
      numberOfOrder: req.body.numberOfOrder,
    }).save();

    const orders = await OrderModel.find();

    return res.status(200).json({
      success: true,
      orders: orders,
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
    // Finding all orders.
    const orders = await OrderModel.find();

    res.status(200).json({
      success: true,
      orders: orders,
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
    // Trying to find order by provided id.
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        order,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getByUser = async (req, res) => {
  try {
    // Trying to find order by provided id.
    const order = await OrderModel.findById(req.userId);

    if (!order) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        order,
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
    // Trying to find order by provided id.
    const order = await OrderModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (order) {
      const orders = await OrderModel.find();
      res.status(200).json({
        success: true,
        orders: orders,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
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
    // Trying to find order by provided id.
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        user_location: req.body.user_location,
        receiver: req.body.receiver,
        user_contact: req.body.user_contact,
        delivery: req.body.delivery,
        payment: req.body.payment,
        payWithParts: req.body.payWithParts,
        items: req.body.items,
        total: req.body.total,
        numberOfOrder: req.body.numberOfOrder,
      },
      { new: true }
    );

    if (order) {
      const orders = await OrderModel.find();
      res.status(200).json({
        success: true,
        orders: orders,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
