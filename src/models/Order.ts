import mongoose, { Schema, Model, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderID: string, // 565343
    vendorId: string,
    items: [any], // [{ food, unit: 1 }]
    totalAmount: number, // 456
    orderDate: Date,
    paidThrough: string, // COD, Credit Card, Wallet
    paymentResponse: string, // { status: true, response: some bank response } Long response object for charge back scenario
    orderStatus: string, // To determine the current status waiting // failed // ACCEPT // REJECT // UNDER-PROCESS // READY
    remarks: string, // remarks of order
    deliveryId: string, // to track the order while delevering the order
    appliedOffers: boolean, // to determine the offers on order
    offerId: string, // if an offer then keep track of the orderId
    readyTime: number, // max 60 minutes
}

const OrderSchema = new Schema({
    orderID: { type: String, required: true },
    vendorId: { type: String },
    items:[
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
            unit: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date},
    paidThrough: { type: String }, // COD, Credit Card, Wallet
    paymentResponse: { type: String }, // { status: true, response: some bank response }
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number }
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true
});

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order }