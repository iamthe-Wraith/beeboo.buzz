import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { prisma } from "$lib/storage/db";
import { ApiError } from "$lib/utils/api-error";
import { validateEmail } from "$lib/utils/validators";
import type { Waitlist } from "@prisma/client";

dayjs.extend(utc);

export class WaitlistService {
    public constructor() {}
    
    public join = async (email: string): Promise<Waitlist> => {
        const validated = validateEmail(email);

        if (validated.error) {
            throw new ApiError(validated.error, 422, 'email');
        }

        return prisma.$transaction(async (tx) => {
            const existingWaitlistEntry = await tx.waitlist.findUnique({
                where: {
                    email,
                },
            });
    
            if (existingWaitlistEntry) {
                throw new ApiError('You are already on the waitlist.', 409);
            }
    
            return await tx.waitlist.create({
                data: {
                    email,
                    createdAt: dayjs().utc().toDate(),
                    updatedAt: dayjs().utc().toDate(),
                },
            });
        })
    }
}