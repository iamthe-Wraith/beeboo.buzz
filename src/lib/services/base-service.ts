import { prisma } from "$lib/storage/db";
import type { PrismaTransaction } from "../../types/prisma";
import type { SessionUser } from "./session";

export interface IBaseServiceProps {
    user: SessionUser;
    tx?: PrismaTransaction;
}

export class BaseService {
    protected user: SessionUser;
    protected tx?: PrismaTransaction;

    constructor({ user, tx }: IBaseServiceProps) {
        this.user = user;
        this.tx = tx;
    }

    protected transaction<T>(cb: (tx: PrismaTransaction) => Promise<T>) {
        if (this.tx) return cb(this.tx);
        return prisma.$transaction(cb);
    }
}