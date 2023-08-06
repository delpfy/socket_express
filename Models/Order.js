import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user_location: {
      city_location: {
        type: String,
        required: true,
      },
    },

    receiver: {
      userIsReceiver: {
        type: Boolean,
        required: true,
      },
      contact: {
        name: {
          type: String,
          required: true,
        },
        surname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
      },
    },

    user_contact: {
      name: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    delivery: {
      delivery_type: {
        type: String,
        required: true,
      },
      delivery_cost: {
        type: Number,
        required: true,
      },
      delivery_location: {
        street: {
          type: String,
          required: true,
        },
        houseNumber: {
          type: String,
          required: true,
        },
        apartmentNumber: {
          type: String,
          required: true,
        },
        floorNumber: {
          type: String,
          required: true,
        },
      },
      novaDepartment: {
        type: String,
      },
      liftRequired: {
        type: Boolean,
      },
      elevator: {
        type: Boolean,
      },
    },

    payment: {
      payment_type: {
        type: String,
        required: true,
      },
      uponReceipt: {
        type: Boolean,
        required: true,
      },
      card: {
        number: {
          type: String,
        },
        date: {
          type: String,
        },
        cvv: {
          type: String,
        },
      },
    },

    payWithParts: {
      months: {
        type: Number,
        required: true,
      },
      perMonth: {
        type: Number,
        required: true,
      },
      firstPay: {
        type: Number,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Определите модель, на которую ссылается
      required: true,
    },

    items: [
      {
        // Вам, вероятно, нужно определить структуру для элементов в массиве
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    numberOfOrder: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
