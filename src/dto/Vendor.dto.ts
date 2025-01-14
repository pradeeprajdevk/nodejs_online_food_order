export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password:string;
}

export interface EditVendorInput {
    name: string;
    address: string;
    phone: string;
    foodType: [string];
}

export interface VendorLoginInputs {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodType: [string];
}

export interface CreateOfferInput {
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