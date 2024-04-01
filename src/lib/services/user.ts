import { prisma } from "$lib/storage/db";
import type { User as UserModel } from "@prisma/client";
import { Service, type IServiceProps } from "./service";
import { validateEmail, validateUsername } from "$lib/utils/validators";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

dayjs.extend(utc)

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
        if (
            !data || 
            (
                !data.username &&
                !data.email
            )
        ) {
            throw new ApiError('No updatable data found.', HttpStatus.BAD_REQUEST);
        }

        // only these fields can be updated on the user object
        const updatableData: {
            username?: string;
            email?: string;
            updatedAt: Date;
        } = {
            updatedAt: dayjs().utc().toDate(),
        };

        // validate username if is being updated
        if (data.username && data.username !== this.user.username) {
            const validated = validateUsername(data.username);

            if (validated.error) throw new Error(validated.error);

            updatableData.username = validated.value;
        }

        // validate email if is being updated
        if (data.email && data.email !== this.user.email) {
            const validated = validateEmail(data.email);

            if (validated.error) throw new Error(validated.error);

            updatableData.email = validated.value;
        }

        const OR = [];

        if (updatableData.username) OR.push({ username: updatableData.username });
        if (updatableData.email) OR.push({ email: updatableData.email });

        // check if username or email is already in use...
        const existingUsers = await prisma.user.findMany({ where: { OR } });

        // ...if so, throw error...
        existingUsers.forEach((user) => {
            if (user.id !== this.user.id) {
                if (user.username === updatableData.username) {
                    throw new ApiError('Username already in use.', HttpStatus.CONFLICT, 'username');
                }

                if (user.email === updatableData.email) {
                    throw new ApiError('Email already in use.', HttpStatus.CONFLICT, 'email');
                }
            }
        });

        // ...otherwise, update user
        return prisma.user.update({
            where: { id: this.user.id },
            data: updatableData,
        });
    }
}