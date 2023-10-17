import OrderModel from "../Models/Order.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_KEY,
    pass: process.env.PASS_KEY ,
  },
});

export const sendOrderStatus = async (email, status) => {
  let testEmailAccount = await nodemailer.createTestAccount();

  try {
    const result = await transporter.sendMail({
      from: '"Сокет" <nodejs@example.com>',
      to: email,
      subject: "Статус замовлення",
      text: "Привіт, це перевірка на те, що введена тобою пошта існує",
      html: `
      <!DOCTYPE html>
      <html>
  <head>
    <meta charset="UTF-8" />
    <style>
          
          a {
            display: inline-block;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            color: black;
            background-color: #ffffff; 
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s linear;
          }

          a:hover {
            background-color: #A0A0A0; 
          }

          a:active {
            background-color: #A0A0A0; 
          }

        </style>
  </head>
  <body
    style="
      background-color: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Roboto Light', sans-serif;
      color: white;
      text-align: center;
      margin: 0;
      padding: 0;
    "
  >
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
      <div
        style="
          display: flex;
          justify-content: center;
          text-align: center;
          width: 100%;
          margin-bottom: 20px;
          margin-top: 10px;
          margin-left: 50px;
        "
      >
        <h1 style="font-size: 38px; margin: 0">Socket</h1>
        <p style="font-size: 24px;  margin-bottom: 50px; margin-top: 0px">.store</p>
      </div>
      <p style="font-size: 24px; margin-bottom: 50px">Дякуємо за співпрацю</p>
      <div style=" margin-top: 60px; margin-bottom: 60px"; text-align: center>
        <span style="font-size: 24px; margin-bottom: 50px; text-align: center; color: white">
        Наразі ваш заказ: 
        </span>
        <div></div>
        <span style="font-size: 24px; margin-bottom: 50px; text-align: center; color: white">
         ${status}
        </span>
      </div>
    </div>
  </body>
</html>

      
  `,
    });
    console.log(result.response);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

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
      status,
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
      status: status || "",
      user: req.userId,
    }).save();

    sendOrderStatus(user_contact?.email, status);

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
        status: req.body.status,
      },
      { new: true }
    );

    console.log(req.body.user_contact.email);
    console.log(req.body.status);

    sendOrderStatus(req.body.user_contact.email, req.body.status);

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
