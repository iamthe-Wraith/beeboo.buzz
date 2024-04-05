import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectsPageFixture } from "../fixtures/projects-page";
import { ProjectPageFixture } from "../fixtures/project-page";

test.describe('project - read', () => {
    test('should display the project info', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const projects = [
            {
                title: 'Test Project 1',
                description: 'Test description 1',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const projectsPage = new ProjectsPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            await quickActions.openProjectModal();
            await quickActions.project.title.fill(project.title);
            if (project.description) await quickActions.project.description.fill(project.description);
            await quickActions.project.createButton.click();
            await expect(quickActions.project.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await expect(nav.contextLinks.projects).toBeInViewport();
        await nav.contextLinks.projects.click({ force: true });

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);

        projectsPage.projects.nth(0).click();

        await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});

        const projectPage = new ProjectPageFixture(page, viewport);

        // project info
        await expect(projectPage.projectInfoContainer).toBeVisible();

        await expect(projectPage.projectInfo.backToProjectsLink).toBeVisible();
        await expect(projectPage.projectInfo.editButton).toBeVisible();
        await expect(projectPage.projectInfo.completeButton).toBeVisible();
        await expect(projectPage.delete.trigger).toBeVisible();

        await expect(projectPage.projectInfo.title).toHaveText(projects[0].title);
        await expect(projectPage.projectInfo.description).toHaveText(projects[0].description);

        // project notes
        await expect(projectPage.projectNotesContainer).toBeVisible();

        await expect(projectPage.notes.title).toHaveText('Notes');
        await expect(projectPage.notes.notes).toHaveCount(0);

        // edit project
        await expect(projectPage.editProjectForm).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking projects link should redirect to /projects', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const projects = [
            {
                title: 'Test Project 1',
                description: 'Test description 1',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const projectsPage = new ProjectsPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            await quickActions.openProjectModal();
            await quickActions.project.title.fill(project.title);
            if (project.description) await quickActions.project.description.fill(project.description);
            await quickActions.project.createButton.click();
            await expect(quickActions.project.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await expect(nav.contextLinks.projects).toBeInViewport();
        await nav.contextLinks.projects.click({ force: true });

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);

        projectsPage.projects.nth(0).click();

        await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});

        const projectPage = new ProjectPageFixture(page, viewport);

        // project info
        await expect(projectPage.projectInfoContainer).toBeVisible();

        await expect(projectPage.projectInfo.backToProjectsLink).toBeVisible();

        await projectPage.projectInfo.backToProjectsLink.click();

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.layout).toBeVisible();

        await signup.cleanup(email, database);
    });
});