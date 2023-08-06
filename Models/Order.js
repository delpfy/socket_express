import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    user_location: {
      city_location: String,
      required: true,
    },

    receiver: {
      userIsReceiver: Boolean,
      contact: {
        name: String,
        surname: String,
        email: String,
        phone: String,
        required: true,
      },
    },

    user_contact: {
      name: String,
      surname: String,
      email: String,
      phone: String,
      required: true,
    },

    delivery: {
      delivery_type: String,
      delivery_cost: Number,
      delivery_location: {
        street: String,
        houseNumber: String,
        apartmentNumber: String,
        floorNumber: String,
      },
      novaDepartment: String,
      liftRequired: Boolean,
      elevator: Boolean,
      required: true,
    },

    payment: {
      payment_type: String,
      uponReceipt: Boolean,
      card: {
        Number: String,
        date: String,
        cvv: String,
      },
      required: true,
    },

    payWithParts: {
      months: Number,
      perMonth: Number,
      firstPay: Number,
      required: true,
    },

    items: [
      {
        required: true,
      },
    ],
    total: Number,
    numberOfOrder: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
