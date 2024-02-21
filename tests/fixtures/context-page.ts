import type { Locator, Page, ViewportSize } from "@playwright/test";

export class ContextPageFixture {
    public layout: Locator;
    public title: Locator;
    public count: Locator;
    public tasks: Locator;
    public noTasks: Locator

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.layout = this.page.getByTestId('context-layout');
        this.title = this.layout.getByTestId('context-title');
        this.count = this.layout.getByTestId('tasks-count');
        this.tasks = this.layout.locator('.task-container');
        this.noTasks = this.layout.getByTestId('no-tasks');
    }
}