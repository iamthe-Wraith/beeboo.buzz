import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectsPageFixture } from "../fixtures/projects-page";
import { ProjectListItemFixture } from "../fixtures/project-list-item";

test.describe('projects - update', () => {
    test('user can complete a project', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';

        const projectData = { title: 'Test Project 1' }

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const projectPage = new ProjectsPageFixture(page, viewport);

        await page.goto('/');

        await signup.signUp({ email, password, confirmPassword: password });

        await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

        await quickActions.openProjectModal();
        await quickActions.project.title.fill(projectData.title);
        await quickActions.project.createButton.click();
        await expect(quickActions.project.modal).not.toBeVisible();

        await nav.openMobileNav();
        await nav.contextLinks.projects.click();

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectPage.projects).toHaveCount(1);

        const project = new ProjectListItemFixture(projectPage.projects.nth(0), page, viewport);

        await expect(project.completeButton).toBeVisible();
        await project.completeButton.click();

        await expect(projectPage.projects).toHaveCount(0);

        await signup.cleanup(email, database);
    });
});