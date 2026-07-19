import { z } from 'zod';
export declare const createComplaintSchema: z.ZodObject<{
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    latitude: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    longitude: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    imageMetadata: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        uploadedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$strip>>;
    issueType: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    ward: z.ZodOptional<z.ZodString>;
    responsibleAuthority: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateComplaintStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        Pending: "Pending";
        Assigned: "Assigned";
        "In Progress": "In Progress";
        Resolved: "Resolved";
        Rejected: "Rejected";
        Escalated: "Escalated";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=complaintSchema.d.ts.map