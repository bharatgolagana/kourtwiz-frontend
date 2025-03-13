import { z } from "zod";

export const demoFormSchema = z.object({
  firstname: z
    .string()
    .nonempty({ message: "First Name is required" })
    .min(2, { message: "First Name must be at least 2 characters" }),
  lastname: z
    .string()
    .nonempty({ message: "Last Name is required" })
    .min(2, { message: "Last Name must be at least 2 characters" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  phonenumber: z
    .string()
    .nonempty({ message: "Phone Number is required" })
    .regex(/^\d{10}$/, { message: "Phone Number must be 10 digits" }),
});

export type DemoFormData = z.infer<typeof demoFormSchema>;
