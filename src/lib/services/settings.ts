import { ContextRole } from "../../types/contexts";
import { ContextService } from "./context";
import { Service, type IServiceProps } from "./service";
import { TaskService } from "./task";

/**
 * Service for managing user settings.
 * 
 * Most of the user's settings can be executed from a single service, like updating
 * the user's information or changing their password. That can all be done form the
 * user service. However, some settings are more complex and require multiple services
 * to be executed. For example, deleting a context requires moving all tasks in that
 * context to another context. This service is for those more complex settings.
 */
export class SettingsService extends Service {
    constructor(props: IServiceProps) {
        super(props);
    }

    public deleteContext = async (id: number) => {
        return this.transaction(async (tx) => {
            const contextService = new ContextService({ user: this.user, tx });
            const inbox = await contextService.getContextByRole(ContextRole.INBOX);

            if (!inbox) {
                throw new Error('Inbox not found.');
            }

            const taskService = new TaskService({ user: this.user, tx });
            await taskService.moveManyToContext(id, inbox);

            return contextService.deleteContext(id);
        });
    };
}