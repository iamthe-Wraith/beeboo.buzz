import type { Locator, Page, ViewportSize } from "@playwright/test";

export class ProjectFixture {
    public completeButton: Locator;
    public completeButtonIcon: Locator;

    public project: Locator;

    public title: Locator;
    public dueDate: Locator;
    
    public icons: {
        pastDue: Locator;
    }

    constructor(
        public readonly container: Locator, 
        public readonly page: Page,
        public readonly viewport?: ViewportSize | null,
    ) {
        this.completeButton = this.container.getByTestId('project-complete-button');
        this.completeButtonIcon = this.completeButton.getByTestId('project-complete-button-icon');

        this.project = this.container.locator('.project');

        this.title = this.container.locator('.title');
        this.dueDate = this.container.locator('.due-date p');

        this.icons = {
            pastDue: this.container.getByTestId('past-due-icon'),
        };
    }
}