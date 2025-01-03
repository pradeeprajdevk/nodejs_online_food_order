import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInputs } from "../dto";
import { Vendor } from "../models";
import { findVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";


export const VendorLogin = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await findVendor(undefined, email);

    if(existingVendor !== null) {
        // Validation and give access
        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

        if (validation) {

            const signature = GenerateSignature({
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
