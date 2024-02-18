import type { SessionUser } from "./session";

export class BaseService {
    constructor(protected readonly user: SessionUser) {}
}