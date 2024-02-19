import { ApiError } from "$lib/utils/api-error";
import { HttpStatus } from "$lib/constants/error";
import { MAX_PROJECT_TITLE_LENGTH } from "$lib/constants/project";
import { Service, type IServiceProps } from "./service";

export interface ICreateProjectRequest {
    title: string;
    description: string;
}

export interface IUpdateProjectRequest {
    id: number;
    title?: string;
    description?: string;
    completed?: boolean;
}

interface IGetOptions {
    includeCompleted: boolean;
}

interface IGetProjectQuery {
    id?: number;
    ownerId: number;
    completed?: boolean;
}

const defaultGetOptions: IGetOptions = {
    includeCompleted: false,
};

export class ProjectService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    //#region Static Methods
    public static isValidNewProjectRequest = (project: ICreateProjectRequest) => {
        const errors: ApiError[] = [];
    
        if (project.title) {
            if (project.title.length > MAX_PROJECT_TITLE_LENGTH) {
                errors.push(new ApiError(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
            }
        } else {
            errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
        }
    
        return errors;
    };

    public static isValidUpdateProjectRequest = (project: IUpdateProjectRequest) => {
        const errors: ApiError[] = [];
    
        if (
            !project.title && 
            !project.description && 
            project.completed === undefined
        ) {
            return [new ApiError('No updatable data received.', HttpStatus.UNPROCESSABLE)];
        }
    
        if (!project.id) {
            return [new ApiError('Project id is required.', HttpStatus.UNPROCESSABLE, 'id')];
        }
    
        if (project.title) {
            if (project.title.length > MAX_PROJECT_TITLE_LENGTH) {
                errors.push(new ApiError(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`, HttpStatus.UNPROCESSABLE, 'title'));
            } 
        } else {
            errors.push(new ApiError('Title is required.', HttpStatus.UNPROCESSABLE, 'title'));
        }
    
        // TODO: Add validation for description
        // descriptions should have a max length to ensure the database can handle it.
    
        if (project.completed === undefined) {
            errors.push(new ApiError('Completed status is required.', HttpStatus.UNPROCESSABLE, 'completed'));
        } else if(typeof project.completed !== 'boolean') {
            errors.push(new ApiError('Invalid completed value received.', HttpStatus.UNPROCESSABLE, 'completed'));
        }
    
        return errors;
    };
    //#region Static Methods

    //#region Public Methods
    public deleteProject = async (projectId: number) => {
        return this.transaction(async (tx) => tx.project.delete({
            where: {
                id: projectId,
                ownerId: this.user.id,
            },
        }));
    }

    public getProjectById = async (id: number) => {
        return this.transaction(async (tx) => tx.project.findFirst({
            where: {
                id,
                ownerId: this.user.id,
            },
        }));
    }

    public getProjects = async (options: IGetOptions = defaultGetOptions) => {
        const query: IGetProjectQuery = {
            ownerId: this.user.id,
        }

        if (!options.includeCompleted) query.completed = false;

        return this.transaction(async (tx) => tx.project.findMany({
            where: { ...query },
        }));
    }

    public quickCreateProject = async (request: ICreateProjectRequest) => {
        const validationErrors = ProjectService.isValidNewProjectRequest(request);
    
        if (validationErrors.length) throw validationErrors;
    
        const { title, description } = request;

        return this.transaction(async (tx) => tx.project.create({
            data: {
                title,
                description,
                ownerId: this.user.id,
            },
        }))
    };

    public updateProject = async (request: IUpdateProjectRequest) => {
        const validationErrors = ProjectService.isValidUpdateProjectRequest(request);
    
        if (validationErrors.length) throw validationErrors;
    
        const { id, title, description, completed } = request;
    
        const project = await this.transaction(async (tx) => tx.project.update({
            where: {
                id,
                ownerId: this.user.id,
            },
            data: {
                title,
                completed,
                description,
            },
        }))
    
        if (!project) throw new ApiError(`Project not found.`, HttpStatus.NOT_FOUND, 'project', { project: id });
    
        return project;
    };
    //#endregion Public Methods

    //#region Private Methods

    //#endregion Private Methods
}
