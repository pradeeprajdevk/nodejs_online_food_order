import mongoose, { Schema, Model, Document, STATES } from "mongoose";

export interface OfferDoc extends Document {
    offerType: string; //VENDOR // GENERIC
    vendors: [any]; // ['85678']
    title: string; // INR 200 off on week days
    description: string; // any description with Terms and Condition
    minValue: number; // minimum  order amount should be 300
    offerAmount: number; // 200
    startValidity: Date; 
    endValidity: Date;
    promoCode: string; // WEEK200
    promoType: string; // USER // ALL // BANK // CARD
    bank: [any];
    bins: [any];
    pincode: string;
    isActive: boolean; 
}

const OfferSchema = new Schema({
  offerType: { type: String, required: true },
  vendors: [{
    type: Schema.Types.ObjectId, ref: 'vendor'
  }],
  title: { type: String, required: true },
  description: String,
  minValue: { type: Number, required: true },
  offerAmount: { type: Number, required: true },
  startValidity: Date,
  endValidity: Date,
  promoCode: { type: String, required: true },
  promoType: { type: String, required: true },
  bank: [
    { type: String }
  ],
  bins: [
    { type: Number }
  ],
  pincode: { type: String, required: true },
  isActive: Boolean,
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

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);

export { Offer };