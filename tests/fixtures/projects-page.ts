import { expect, type Locator, type Page, type ViewportSize } from "@playwright/test";
import type { Project } from "@prisma/client";

export class ProjectsPageFixture {
    public layout: Locator;
    public title: Locator;
    public count: Locator;
    public projects: Locator;
    public noProjects: Locator;

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.layout = this.page.getByTestId('projects-layout');
        this.title = this.layout.getByTestId('projects-title');
        this.count = this.layout.getByTestId('projects-count');
        this.projects = this.layout.locator('.project-container');
        this.noProjects = this.layout.getByTestId('no-projects');
    }

    public assertProjectExists = async (project: Project) => {
        const projectItem = this.projects.getByTestId(`${project.id}`);
        await expect(projectItem).toBeVisible();

        const projectTitle = projectItem.getByTestId('project-title');
        await expect(projectTitle).toBeVisible();
        await expect(projectTitle).toHaveText(project.title);
    }
}