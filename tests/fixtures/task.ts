import type { Locator, Page, ViewportSize } from "@playwright/test";

export class TaskFixture {
    public completeButton: Locator;
    public completeButtonIcon: Locator;

    public task: Locator;

    public title: Locator;
    public dueDate: Locator;
    
    public icons: {
        pastDue: Locator;
        notes: Locator;
    }

    public modal: Locator;

    public form: Locator;

    public editable: {
        title: Locator;
        notes: Locator;
        context: Locator;
        contextTrigger: Locator;
        contextValue: Locator;
    }

    public updateButton: Locator;
    public createButton: Locator;
    public cancelButton: Locator;

    constructor(
        public readonly container: Locator, 
        public readonly page: Page,
        public readonly viewport?: ViewportSize | null,
    ) {
        this.completeButton = this.container.getByTestId('task-complete-button');
        this.completeButtonIcon = this.completeButton.getByTestId('task-complete-button-icon');

        this.task = this.container.locator('.task');

        this.title = this.container.locator('.title');
        this.dueDate = this.container.locator('.due-date p');

        this.icons = {
            pastDue: this.container.getByTestId('past-due-icon'),
            notes: this.container.getByTestId('notes-icon'),
        };

        this.modal = this.page.getByTestId('task-modal');

        this.form = this.modal.getByTestId('task-form');

        const contextContainer = this.form.locator('#context-container');

        this.editable = {
            title: this.form.getByTestId('task-title'),
            notes: this.form.getByTestId('task-notes'),
            context: contextContainer,
            contextTrigger: contextContainer.locator('#context'),
            contextValue: contextContainer.locator('[name="contextId"]'),
        };

        this.updateButton = this.form.getByTestId('task-update');
        this.createButton = this.form.getByTestId('task-create');
        this.cancelButton = this.form.getByTestId('task-cancel');
    }
}