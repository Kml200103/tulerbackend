import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      price: Number,
      quantity: Number,
      totalPrice: Number,
    }
  ],
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELED'], default: 'PENDING' },
  paymentStatus: { type: String, enum: ['PAID', 'UNPAID'], default: 'UNPAID' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
