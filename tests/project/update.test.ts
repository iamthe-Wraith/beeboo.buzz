import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectsPageFixture } from "../fixtures/projects-page";
import { ProjectPageFixture } from "../fixtures/project-page.test";

test.describe('project - update', () => {
    test('clicking the edit button displays the project edit form', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const projects = [
            {
                title: 'Test Project 1',
                notes: 'Test Notes 1',
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
            if (project.notes) await quickActions.project.notes.fill(project.notes);
            await quickActions.project.createButton.click();
            await expect(quickActions.project.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await nav.contextLinks.projects.click({ force: true });

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);

        projectsPage.projects.nth(0).click();

        await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});

        const projectPage = new ProjectPageFixture(page, viewport);

        await expect(projectPage.projectInfo.editButton).toBeVisible();
        await projectPage.projectInfo.editButton.click();

        // edit project
        await expect(projectPage.editProjectForm).toBeVisible();

        await expect(projectPage.edit.title).toHaveValue(projects[0].title);
        await expect(projectPage.edit.description).toHaveValue(projects[0].notes);
        await expect(projectPage.edit.submitButton).toBeVisible();
        await expect(projectPage.edit.submitButton).toBeDisabled();
        await expect(projectPage.edit.cancelButton).toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking the cancel button returns user to project details page', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const projects = [
            {
                title: 'Test Project 1',
                notes: 'Test Notes 1',
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
            if (project.notes) await quickActions.project.notes.fill(project.notes);
            await quickActions.project.createButton.click();
            await expect(quickActions.project.modal).not.toBeVisible();
        }

        await nav.openMobileNav();
        await nav.contextLinks.projects.click({ force: true });

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);

        projectsPage.projects.nth(0).click();

        await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});

        const projectPage = new ProjectPageFixture(page, viewport);

        await expect(projectPage.projectInfo.editButton).toBeVisible();
        await projectPage.projectInfo.editButton.click();

        await expect(projectPage.editProjectForm).toBeVisible();
        await expect(projectPage.projectInfoContainer).not.toBeVisible();

        await expect(projectPage.edit.cancelButton).toBeVisible();
        await projectPage.edit.cancelButton.click();
        
        await expect(projectPage.projectInfoContainer).toBeVisible();

        await signup.cleanup(email, database);
    });
});