import { prisma } from "$lib/storage/db";
import type { User as UserModel } from "@prisma/client";
import { Service, type IServiceProps } from "./service";
import { validateEmail, validateUsername } from "$lib/utils/validators";
import dayjs from "dayjs";

export class UserService extends Service {
    public constructor(props: IServiceProps) {
        super(props);
    }

    public static getById = (id: number): Promise<UserModel | null> => {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    public update = async (data: Partial<UserModel>): Promise<UserModel> => {
        if (!data || !Object.keys(data).length) throw new Error('No updatable data found.');

        const updatableData: {
            username?: string;
            email?: string;
            updatedAt: Date;
        } = {
            updatedAt: dayjs().utc().toDate(),
        };

        if (data.username && data.username !== this.user.username) {
            const validated = validateUsername(data.username);

            if (validated.error) throw new Error(validated.error);

            updatableData.username = validated.value;
        }

        if (data.email && data.email !== this.user.email) {
            const validated = validateEmail(data.email);

            if (validated.error) throw new Error(validated.error);

            // TODO: confirm email is not already in use

            updatableData.email = validated.value;
        }

        // TODO: confirm new username and new email are not already in use

        // update user data
        return prisma.user.update({
            where: { id: this.user.id },
            data: updatableData,
        });
    }
}