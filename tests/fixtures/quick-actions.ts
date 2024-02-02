import type { Locator, Page, ViewportSize } from "@playwright/test";
import { NavFixture } from "./nav";

interface IQuickActions {
    container: Locator;
    newProject: Locator;
    newTask: Locator;
}

export class QuickActionsFixture {
    public isMobile: boolean;

    public nav: NavFixture;

    public desktopQuickActions: IQuickActions;
    public mobileQuickActions: IQuickActions;

    public taskModal: Locator;
    public taskModalClose: Locator;

    public taskForm: Locator;

    public taskTitle: Locator;
    public taskNotes: Locator;

    public taskTitleError: Locator;
    public taskNotesError: Locator;
    public taskGenError: Locator;

    public taskCancelButton: Locator;
    public taskCreateButton: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.isMobile = !!viewport && viewport.width < 768;

        this.nav = new NavFixture(page, viewport);

        this.desktopQuickActions = this.nav.desktopQuickActions;

        this.mobileQuickActions = {
            container: this.page.getByTestId('mobile-quick-actions'),
            newProject: this.page.getByTestId('mobile-quick-actions').getByTestId('new-quick-project-button'),
            newTask: this.page.getByTestId('mobile-quick-actions').getByTestId('new-quick-task-button'),
        };

        if (this.isMobile) {
            this.taskModal = this.mobileQuickActions.container.getByTestId('new-quick-task-modal');
        } else {
            this.taskModal = this.desktopQuickActions.container.getByTestId('new-quick-task-modal');
        }
        
        this.taskModalClose = this.taskModal.getByTestId('close-modal-button');

        this.taskForm = this.taskModal.getByTestId('new-quick-task-form');

        this.taskTitle = this.taskForm.getByTestId('new-quick-task-title');
        this.taskNotes = this.taskForm.getByTestId('new-quick-task-notes');

        this.taskTitleError = this.taskForm.getByTestId('title-error');
        this.taskNotesError = this.taskForm.getByTestId('notes-error');
        this.taskGenError = this.taskForm.getByTestId('new-quick-task-gen-error');

        this.taskCancelButton = this.taskForm.getByTestId('new-quick-task-cancel');
        this.taskCreateButton = this.taskForm.getByTestId('new-quick-task-create');
    }

    public async openTaskModal() {
        if (this.isMobile) {
            await this.mobileQuickActions.newTask.click();
        } else {
            await this.desktopQuickActions.newTask.click();
        }
    }
}