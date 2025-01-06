import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const findVendor = async (id: string | undefined, email?: string): Promise<any> => {
    if (email) {
        return await Vendor.findOne({ email: email });
    } else {
        return await Vendor.findById(id);
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = <CreateVendorInput>req.body;

    const existingVendor = await findVendor('', email);

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
        coverImage: [],
        foods: []
    });

    return res.json(createVendor);
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const vendors = await Vendor.find();

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ message: "Vendors data not available." });
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const vendorId = req.params.id;

    const vendor = await findVendor(vendorId);

    if (vendor !== null) {
        return res.json(vendor);
    }

    return res.json({ message: "Vendor data not available" });
}