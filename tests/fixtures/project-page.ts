import type { Locator, Page, ViewportSize } from "@playwright/test";

export class ProjectPageFixture {
    public layout: Locator;
    public title: Locator;
    public count: Locator;
    public projects: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.layout = this.page.getByTestId('project-layout');
        this.title = this.layout.getByTestId('project-title');
        this.count = this.layout.getByTestId('projects-count');
        this.projects = this.layout.locator('.project-container');
    }
}