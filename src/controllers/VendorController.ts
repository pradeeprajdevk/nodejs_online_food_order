import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInputs } from "../dto";
import { Food, Vendor } from "../models";
import { findVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Order } from "../models/Order";


export const VendorLogin = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await findVendor(undefined, email);

    if(existingVendor !== null) {
        // Validation and give access
        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

        if (validation) {

            const signature = await GenerateSignature({
                _id: existingVendor._id,
                name: existingVendor.name,
                email: existingVendor.email,
                foodType: existingVendor.foodType
            })

            return res.json(signature);
        } else {
            return res.json({ message: "Password is not valid" });
        }
    }

    return res.json({ message: "Login credential not valid" });
}

export const GetVendorProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if(user) {
        const existingVendor = await findVendor(user._id);

        return res.json(existingVendor);
    }

    return res.json({ message: "Vendor not found" });
}

export const UpdateVendorProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, address, phone, foodType } = <EditVendorInput>req.body;

    const user = req.user;

    if(user) {
        const existingVendor = await findVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const savedResult = await existingVendor.save();
            return res.json(savedResult);
        }

        return res.json(existingVendor);
    }

    return res.json({ message: "Vendor not found" });
}

export const UpdateVendorCoverImage = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if(user) {

        const vendor = await findVendor(user._id);

        if(vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            vendor.coverImages.push(...images); 

            const result = await vendor.save();

            return res.json(result);
        }
    }

    return res.json({ message: "Unable to Update vendor profile " });
}

export const UpdateVendorService = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if(user) {
        const existingVendor = await findVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

            const savedResult = await existingVendor.save();
            return res.json(savedResult);
        }

        return res.json(existingVendor);
    }

    return res.json({ message: "Vendor not found" });
}


export const AddFood = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if(user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

        const vendor = await findVendor(user._id);

        if(vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createFood = await Food.create({
               vendorId: vendor._id,
               name,
               description,
               category,
               foodType,
               readyTime,
               price,
               images: images,
               rating: 0
            });

            vendor.foods.push(createFood);
            const result = await vendor.save();
            return res.json(result);
        }
    }

    return res.json({ message: "Something went wrong with Add Food." });
}

export const GetFoods = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if(user) {
        const foods =  await Food.find({ vendorId: user._id});

        if (foods !== null) {
            return res.json(foods);
        }
    }

    return res.json({ message: "Food information not found" });
}

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const user = req.user;

    if (user) {
        const orders = await Order.find({ vendorId: user._id }).populate('items.food');

        if (orders !== null) {
            return res.status(200).json(orders);
        }
    }

    return res.status(400).json({ message: "Order not found" });
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    
    const orderId = req.params.id;
    
    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        if (order !== null) {
            return res.status(200).json(order);
        }
    }

    return res.status(400).json({ message: "Order not found" });
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const orderId = req.params.id;

    const { status, remarks, time } = req.body; // ACCEPT // REJECT // UNDER-PROCESS // READY

    if (orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        order.orderStatus = status;
        order.remarks = remarks;

        if (time) {
            order.readyTime = time;
        }

        const orderResult = await order.save();

        if (orderResult !== null) {
            return res.status(200).json(orderResult);
        }
    }

    return res.status(400).json({ "message": "Unable to process order" });
}