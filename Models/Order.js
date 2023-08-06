import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],

    user_location: {
      city_location: {
        type: String,
      },
    },

    receiver: {
      userIsReceiver: {
        type: Boolean,
      },
      contact: {
        name: {
          type: String,
        },
        surname: {
          type: String,
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
        },
      },
    },

    user_contact: {
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },

    delivery: {
      delivery_type: {
        type: String,
      },
      delivery_cost: {
        type: Number,
      },
      delivery_location: {
        street: {
          type: String,
        },
        houseNumber: {
          type: String,
        },
        apartmentNumber: {
          type: String,
        },
        floorNumber: {
          type: String,
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
      },
      uponReceipt: {
        type: Boolean,
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
      },
      perMonth: {
        type: Number,
      },
      firstPay: {
        type: Number,
      },
    },

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
