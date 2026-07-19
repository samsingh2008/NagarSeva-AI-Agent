import { z } from 'zod';
export const createComplaintSchema = z.object({
    description: z.string().trim().max(1000).optional().default(''),
    latitude: z.coerce.number().finite().optional(),
    longitude: z.coerce.number().finite().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    imageMetadata: z
        .object({
        name: z.string().optional(),
        mimeType: z.string().optional(),
        size: z.number().optional(),
        uploadedAt: z.coerce.date().optional(),
    })
        .optional(),
    issueType: z.string().trim().optional(),
    severity: z.string().trim().optional(),
    address: z.string().trim().optional(),
    ward: z.string().trim().optional(),
    responsibleAuthority: z.string().trim().optional(),
});
export const updateComplaintStatusSchema = z.object({
    status: z.enum(['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Escalated']),
});
//# sourceMappingURL=complaintSchema.js.map