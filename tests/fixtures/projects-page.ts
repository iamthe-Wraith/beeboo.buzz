import type { Locator, Page, ViewportSize } from "@playwright/test";

export class ProjectsPageFixture {
    public layout: Locator;
    public title: Locator;
    public count: Locator;
    public projects: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.layout = this.page.getByTestId('projects-layout');
        this.title = this.layout.getByTestId('projects-title');
        this.count = this.layout.getByTestId('projects-count');
        this.projects = this.layout.locator('.project-container');
    }
}