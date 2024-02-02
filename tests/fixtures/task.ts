import type { Locator, ViewportSize } from "@playwright/test";

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

    constructor(public readonly container: Locator, public readonly viewport?: ViewportSize | null) {
        this.completeButton = this.container.getByTestId('task-complete-button');
        this.completeButtonIcon = this.completeButton.getByTestId('task-complete-button-icon');

        this.task = this.container.locator('.task');

        this.title = this.container.locator('.title');
        this.dueDate = this.container.locator('.due-date p');

        this.icons = {
            pastDue: this.container.getByTestId('past-due-icon'),
            notes: this.container.getByTestId('notes-icon'),
        };
    }
}