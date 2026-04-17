import { z } from 'zod';
import { Types } from 'mongoose';

export const mongoId = (field = 'ID') =>
  z
    .string()
    .min(1, `${field} is required`)
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid ${field} format`)
