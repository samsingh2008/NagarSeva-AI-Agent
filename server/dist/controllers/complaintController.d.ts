import { Request, Response } from 'express';
export declare const createComplaint: (req: Request, res: Response) => Promise<void>;
export declare const getComplaints: (_req: Request, res: Response) => Promise<void>;
export declare const getComplaintById: (req: Request, res: Response) => Promise<void>;
export declare const updateComplaintStatus: (req: Request, res: Response) => Promise<void>;
export declare const checkEscalation: (req: Request, res: Response) => Promise<void>;
export declare const getSafetyHeatmap: (_req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=complaintController.d.ts.map