import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


export const CreateVendor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = <CreateVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email: email });

    if (existingVendor !== null) {
        return res.json({"message": "A vendor is existing with this emailID"});
    }

    // Generate the salt
    const salt = await GenerateSalt();

    // Encrypt the password using the salt
    const userPassword = await GeneratePassword(password, salt);

    const createVendor = await Vendor.create({
        name,
        ownerName,
        foodType,
        pincode,
        address,
        phone,
        email,
        password: userPassword,
        salt: salt,
        rating: 0,
        serviceAvailable: false,
        coverImage: []
    });

    return res.json(createVendor);
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    
}