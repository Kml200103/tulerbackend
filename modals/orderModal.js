import mongoose from "mongoose";
import { paymentStatus, statusTypes } from "../constants/constant.js";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId,ref:'Address', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      price: Number,
      quantity: Number,
      totalPrice: Number,
      variantId:{type:mongoose.Schema.Types.ObjectId,required:true}
    }
  ],
  totalPrice:Number,
  status: { type: String, enum: Object.values(statusTypes), default: statusTypes.PENDING },
  paymentStatus: { type: String, enum: Object.values(paymentStatus), default: paymentStatus.UNPAID },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
