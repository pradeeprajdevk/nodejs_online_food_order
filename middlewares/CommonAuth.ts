import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utility";



declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const validate = await ValidateSignature(req);

    if (validate) {
        next();
    } else {
        return res.json({ message: "User not authorized" });
    }
}