import { prisma } from "$lib/storage/db";
import type { User as UserModel } from "@prisma/client";

export class User {
    public static getById = (id: number): Promise<UserModel | null> => {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}