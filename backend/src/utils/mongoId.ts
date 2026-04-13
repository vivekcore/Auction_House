
import { z } from 'zod';
import { Types } from 'mongoose';

export const mongoId = (field = 'ID') =>
  z
    .string().min(1, `${field} is required`)
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid ${field} format`)
    .transform((val) => new Types.ObjectId(val))          
    .refine((val) => val instanceof Types.ObjectId, {      
      message: `Failed to convert ${field} to ObjectId`,
    });