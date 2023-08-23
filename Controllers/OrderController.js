import OrderModel from "../Models/Order.js";

export const create = async (req, res) => {
  // Trying to create new order and if successful, save it to database.
  try {
    const {
      user_location,
      receiver,
      user_contact,
      delivery,
      payment,
      payWithParts,
      items,
      total,
      numberOfOrder,
    } = req.body;

    const order = await new OrderModel({
      user_location: {
        city_location: user_location?.city_location || "",
      },
      receiver: {
        userIsReceiver: receiver?.userIsReceiver || false,
        contact: {
          name: receiver?.contact?.name || "",
          surname: receiver?.contact?.surname || "",
          email: receiver?.contact?.email || "",
          phone: receiver?.contact?.phone || "",
        },
      },
      user_contact: {
        name: user_contact?.name || "",
        surname: user_contact?.surname || "",
        email: user_contact?.email || "",
        phone: user_contact?.phone || "",
      },
      delivery: {
        delivery_type: delivery?.delivery_type || "",
        delivery_cost: delivery?.delivery_cost || 0,
        delivery_location: {
          street: delivery?.delivery_location?.street || "",
          houseNumber: delivery?.delivery_location?.houseNumber || "",
          apartmentNumber: delivery?.delivery_location?.apartmentNumber || "",
          floorNumber: delivery?.delivery_location?.floorNumber || "",
        },
        novaDepartment: delivery?.novaDepartment || "",
        liftRequired: delivery?.liftRequired || false,
        elevator: delivery?.elevator || false,
      },
      payment: {
        payment_type: payment?.payment_type || "",
        uponReceipt: payment?.uponReceipt || false,
        card: {
          number: payment?.card?.number || "",
          date: payment?.card?.date || "",
          cvv: payment?.card?.cvv || "",
        },
      },
      payWithParts: {
        months: payWithParts?.months || 0,
        perMonth: payWithParts?.perMonth || 0,
        firstPay: payWithParts?.firstPay || 0,
      },
      items: items || [],
      total: total || 0,
      numberOfOrder: numberOfOrder || "",
      user: req.userId,
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
    const orders = await OrderModel.find({ user: { $eq: req.params.id } });

    if (!orders) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        orders,
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
