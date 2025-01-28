import express, { Request, Response, NextFunction } from "express";

import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateDeliveryUserInputs, EditCustomerInputs, UserLoginInputs } from "../dto/Customer.dto";
import { DeliveryUser } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";

export const findDeliveryUser = async(id: string | undefined, email?: string) => {
  if (email) {
      return await DeliveryUser.findOne({email: email});
  } else {
      return await DeliveryUser.findById(id);
  }
}

export const DeliveryUserSignup = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const deliveryInputs = plainToClass(CreateDeliveryUserInputs, req.body);

  const inputErrors = await validate(deliveryInputs, { validationError: { target: true }});

  if (inputErrors.length > 0) {
      return res.status(400).json(inputErrors);
  }

  const { email, phone, password, firstName, lastName, address, pincode } = deliveryInputs;

  const existingDeliveryUser = await findDeliveryUser('', email);
  
  if(existingDeliveryUser !== null) {
      return res.json({"message": "A delivery user is existing with this emailID"});
  } 

  // Generate the salt
  const salt = await GenerateSalt();
  
  // Encrypt the password using the salt
  const userPassword = await GeneratePassword(password, salt);

  const createDeliveryUser = await DeliveryUser.create({
      email: email,
      password: userPassword,
      salt: salt,
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      address: address,
      pincode: pincode,
      verified: false,
      lat: 0,
      lng: 0,
      isAvailable: false
  });

  if (createDeliveryUser) {
      // generate the signature
      const signature = await GenerateSignature({
          _id: createDeliveryUser._id as string,
          email: createDeliveryUser.email,
          verified: createDeliveryUser.verified
      });

      // send the result to client
      return res.status(200).json({
          signature,
          verified: createDeliveryUser.verified,
          email: createDeliveryUser.email
      });
  }

  return res.status(400).json({
      message: "Error with signup"
  });
}


export const DeliveryUserLogin = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
  const customerInputs = plainToClass(UserLoginInputs, req.body);

  const validationError = await validate(customerInputs, { validationError: { target: true } });

  if (validationError.length > 0) {
      return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const deliveryUser = await findDeliveryUser('', email);

  if (deliveryUser) {
      const validation = await ValidatePassword(password, deliveryUser.password, deliveryUser.salt);

      if (validation) {
          
          const signature = await GenerateSignature({
              _id: deliveryUser._id as string,
              email: deliveryUser.email,
              verified: deliveryUser.verified
          });

          return res.status(200).json({
              signature,
              email: deliveryUser.email,
              verified: deliveryUser.verified
          });
      }
  }

  return res.json({ message: 'Error With Login'});

}

export const GetDeliveryUserProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const deliveryUser = req.user;

    if (deliveryUser) {
        const profile = await findDeliveryUser(deliveryUser._id);

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(400).json({ msg: 'Error while Fetching Profile'});
}

export const EditDeliveryUserProfile = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
  const deliveryUser = req.user;

  const customerInputs = plainToClass(EditCustomerInputs, req.body);

  const validationError = await validate(customerInputs, { validationError: { target: true } });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }
  
  const { firstName, lastName, address  } = customerInputs;

  if (deliveryUser) {
    const profile = await findDeliveryUser(deliveryUser._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const UpdatedDeliveryUserProfile = await profile.save();

      return res.status(200).json(UpdatedDeliveryUserProfile);
    }
  }

  return res.status(400).json({ msg: 'Error while Updating Profile'});
}


export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const { lat, lng } = req.body;

    const profile = await findDeliveryUser(deliveryUser._id);

    if (profile) {
      if(lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      profile.isAvailable = !profile.isAvailable;

      const result = await profile.save();

      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({
    message: "Error while fetch profile"
  });
}