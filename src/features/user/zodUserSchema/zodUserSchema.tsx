import { z } from 'zod';

export const userSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  primaryNumber: z.string().min(10, 'Primary number must be at least 10 digits'),
  secondaryNumber: z.string().optional(),
  employeeNo: z.string().optional(),
  identificationNo: z.string().min(1, 'Identification number is required'),
  selectedIdentificationType: z.string().min(1, 'Please select an identification type'),
  selectedRole: z.string().min(1, 'Please select a role'),
  selectedProfile: z.string().min(1, 'Please select a profile'),
  gender: z.string(),
});
