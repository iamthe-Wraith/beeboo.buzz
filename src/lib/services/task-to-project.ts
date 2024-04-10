import { HttpStatus } from "$lib/constants/error";
import { ApiError } from "$lib/utils/api-error";
import { ProjectService } from "./project";
import { Service, type IServiceProps } from "./service";
import { TaskService } from "./task";

export class TaskToProjectService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    public convertToProject = async (taskId: number) => {
        return this.transaction(async (tx) => {
            const taskService = new TaskService({ user: this.user, tx });
            const projectService = new ProjectService({ user: this.user, tx });

            const task = await taskService.getTaskById(taskId);

            if (!task) throw new ApiError('Task not found.', HttpStatus.NOT_FOUND);

            const project = await projectService.createProject({
                title: task.title,
                description: task.description || '',
                convertedFromTask: true,
            });

            await taskService.deleteTask(taskId);

            return project;
        });
    };
}