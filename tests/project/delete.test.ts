import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectsPageFixture } from "../fixtures/projects-page";
import { ProjectPageFixture } from "../fixtures/project-page.test";

test.describe('project - delete', () => {
    test('clicking the delete button should display a confirmation modal', async ({ page, viewport, database }) => {
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

        await expect(projectPage.delete.trigger).toBeVisible();
        await projectPage.delete.trigger.click();

        await expect(projectPage.delete.modal).toBeVisible();
        await expect(projectPage.delete.header).toHaveText('Are you sure?');
        await expect(projectPage.delete.text).toHaveText('Are you sure you want to delete this project? Any tasks linked to this project will be unlinked. This cannot be undone.');
        await expect(projectPage.delete.confirmButton).toBeVisible();
        await expect(projectPage.delete.cancelButton).toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking the cancel button within the confirmation modal should close the modal and cancel the deletion', async ({ page, viewport, database }) => {
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

        await projectPage.delete.trigger.click();

        await expect(projectPage.delete.cancelButton).toBeVisible();
        await projectPage.delete.cancelButton.click();

        await expect(projectPage.delete.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });

    test('clicking the delete button within the confirmation modal should delete the project', async ({ page, viewport, database }) => {
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

        await projectPage.delete.trigger.click();

        await expect(projectPage.delete.confirmButton).toBeVisible();
        await projectPage.delete.confirmButton.click();

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(0);

        await expect(projectPage.delete.modal).not.toBeVisible();

        await signup.cleanup(email, database);
    });
});