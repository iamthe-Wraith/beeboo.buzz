import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectListItemFixture } from "../fixtures/project-list-item";
import { ProjectsPageFixture } from "../fixtures/projects-page";

test.describe('projects - read', () => {
    test('should display messaging when no projects are found', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const projectPage = new ProjectsPageFixture(page, viewport);

        try {
            await page.goto('/');

            await signup.signUp({ email, password, confirmPassword: password });

            await page.waitForURL('/dashboard', {waitUntil: 'networkidle'});

            await nav.openMobileNav();
            await expect(nav.contextLinks.projects).toBeInViewport();
            await nav.contextLinks.projects.click({ force: true });

            await page.waitForURL('/projects', {waitUntil: 'networkidle'});

            await expect(projectPage.layout).toBeVisible();
            await expect(projectPage.title).toHaveText('Projects');
            await expect(projectPage.count).toHaveText(`${0} projects`);
            await expect(projectPage.projects).toHaveCount(0);
            await expect(projectPage.noProjects).toBeVisible();
            await expect(projectPage.noProjects).toHaveText('No projects found');
        } finally {
            await signup.cleanup(email, database);
        }
    });

    test('should display all a user\'s projects', async ({ page, viewport, database }) => {
        const email = getEmail();
        const password = 'Password123!';
        const projects = [
            {
                title: 'Test Project 1',
                description: 'Test description 1',
            },
            {
                title: 'Test Project 2',
                description: 'Test description 2',
            },
            {
                title: 'Test Project 3',
            },
            {
                title: 'Test Project 4',
            },
            {
                title: 'Test Project 5',
                description: 'Test description 5',
            },
        ];

        const signup = new SignUpFixture(page);
        const nav = new NavFixture(page, viewport);
        const quickActions = new QuickActionsFixture(page, viewport);
        const projectPage = new ProjectsPageFixture(page, viewport);

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

        await expect(projectPage.layout).toBeVisible();
        await expect(projectPage.title).toHaveText('Projects');
        await expect(projectPage.count).toHaveText(`${projects.length} projects`);
        await expect(projectPage.projects).toHaveCount(projects.length);

        await signup.cleanup(email, database);
    });

    test('project should display a completion button, and a title', async ({ page, viewport, database }) => {
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
        await expect(project.completeButtonIcon).toHaveCSS('opacity', '0');
        await expect(project.title).toHaveText(projectData.title);

        await signup.cleanup(email, database);
    });
});