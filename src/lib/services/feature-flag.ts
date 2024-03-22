import { UserRole } from "@prisma/client";
import { Service, type IServiceProps } from "./service";
import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";

export interface ICreateFeatureFlagRequest {
    name: string;
    description?: string;
    isEnabled: boolean;
}

export class FeatureFlagService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    public createFeatureFlag = async ({ name, description, isEnabled }: ICreateFeatureFlagRequest) => {
        this.authorize();

        return this.transaction(async (tx) => tx.featureFlag.create({
            data: {
                name,
                description,
                isEnabled,
                updatedBy: this.user.id,
            },
        }));
    };

    public getFeatureFlags = () => {
        this.authorize();
    
        return this.transaction(async (tx) => tx.featureFlag.findMany());
    };

    /**
     * Check if the user is authorized to perform the action. If not, throw an error.
     */
    public authorize = () => {
        if (
            !this.user ||
            !this.user.role ||
            (
                this.user.role !== UserRole.ADMIN &&
                this.user.role !== UserRole.SUPER_ADMIN
            )
        ) {
            throw new ApiError('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}