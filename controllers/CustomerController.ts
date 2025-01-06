import express, { Request, Response, NextFunction } from "express";

import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInputs, EditCustomerInputs, UserLoginInputs } from "../dto/Customer.dto";
import { Customer } from "../models";
import { GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, ValidatePassword } from "../utility";

export const findCustomer = async(id: string | undefined, email?: string) => {
    if (email) {
        return await Customer.findOne({email: email});
    } else {
        return await Customer.findById(id);
    }
}

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    const inputErrors = await validate(customerInputs, { validationError: { target: true }});

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInputs;

    const existingCustomer = await findCustomer('', email);
    
    if(existingCustomer !== null) {
        return res.json({"message": "A customer is existing with this emailID"});
    } 

    // Generate the salt
    const salt = await GenerateSalt();
    
    // Encrypt the password using the salt
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOTP();

    const createCustomer = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    });

    if (createCustomer) {
        // send the OTP to customer
        await onRequestOTP(otp, phone);

        // generate the signature
        const signature = await GenerateSignature({
            _id: createCustomer._id as string,
            email: createCustomer.email,
            verified: createCustomer.verified
        });

        // send the result to client
        return res.status(200).json({
            signature,
            verified: createCustomer.verified,
            email: createCustomer.email
        });
    }

    return res.status(400).json({
        message: "Error with signup"
    });
}


export const CustomerLogin = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const customerInputs = plainToClass(UserLoginInputs, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const customer = await findCustomer('', email);

    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if (validation) {
            
            const signature = await GenerateSignature({
                _id: customer._id as string,
                email: customer.email,
                verified: customer.verified
            });

            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            });
        }
    }

    return res.json({ message: 'Error With Login'});

}

export const CustomerVerify = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { otp } = req.body;
    const customer = req.user;

    if (customer) {
        const profile = await findCustomer(customer._id);

        if (profile) {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();

                // generate the signature
                const signature = await GenerateSignature({
                    _id: updatedCustomerResponse._id as string,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                });

                // send the result to client
                return res.status(200).json({
                    signature,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                });
            }
        }
    }

    return res.status(400).json({ msg: 'Unable to verify Customer'});
}

export const RequestOTP = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const customer = req.user;

    if (customer) {
        const profile = await findCustomer(customer._id);

        if (profile) {
            const { otp, expiry } = GenerateOTP();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            const sendCode = await onRequestOTP(otp, profile.phone);

            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' });
            }

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number' });
        }
    }
}

export const GetCustomerProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const customer = req.user;

    if (customer) {
        const profile = await findCustomer(customer._id);

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(400).json({ msg: 'Error while Fetching Profile'});
}

export const EditCustomerProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const customer = req.user;

    const customerInputs = plainToClass(EditCustomerInputs, req.body);

    const validationError = await validate(customerInputs, { validationError: { target: true } });

    if (validationError.length > 0) {
        return res.status(400).json(validationError);
    }
    
    const { firstName, lastName, address  } = customerInputs;

    if (customer) {
        const profile = await findCustomer(customer._id);

        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const UpdatedCustomerProfile = await profile.save();

            return res.status(200).json(UpdatedCustomerProfile);
        }
    }

    return res.status(400).json({ msg: 'Error while Updating Profile'});
}