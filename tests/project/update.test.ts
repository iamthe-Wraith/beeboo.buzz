import { getEmail } from "../helpers";
import { SignUpFixture } from "../fixtures/signup";
import { QuickActionsFixture } from "../fixtures/quick-actions";
import { test, expect } from "../custom-test";
import { NavFixture } from "../fixtures/nav";
import { ProjectsPageFixture } from "../fixtures/projects-page";
import { ProjectPageFixture } from "../fixtures/project-page";
import { MAX_PROJECT_DESCRIPTION_LENGTH, MAX_PROJECT_TITLE_LENGTH } from "$lib/constants/project";

test.describe('project - update', () => {
    test('user should be able to complete the project', async ({ page, viewport, database }) => {
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
        await nav.contextLinks.projects.click({ force: true });

        await page.waitForURL('/projects', {waitUntil: 'networkidle'});

        await expect(projectsPage.projects).toHaveCount(1);

        const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
        const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);

        projectsPage.projects.nth(0).click();

        await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});

        const projectPage = new ProjectPageFixture(page, viewport);

        await expect(projectPage.projectInfo.status).toBeVisible();
        await expect(projectPage.projectInfo.status).toHaveText('In Progress');

        await expect(projectPage.projectInfo.completeButton).toBeVisible();

        await expect(projectPage.projectInfo.completeButton).toHaveText('Complete');
        await projectPage.projectInfo.completeButton.click();

        await expect(projectPage.projectInfo.completeButton).toHaveText('Reopen');
        await expect(projectPage.projectInfo.status).toHaveText('Completed');

        await signup.cleanup(email, database);
    });

    test.describe('edit project info', () => {
        test('clicking the edit button displays the project edit form', async ({ page, viewport, database }) => {
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
            await expect(projectPage.edit.description).toHaveValue(projects[0].description);
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
    
        test('user should be able to update the project title', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.title.clear();
            await projectPage.edit.title.fill('Updated Title');
            await projectPage.edit.title.blur();
    
            await projectPage.edit.submitButton.click();
            
            await expect(projectPage.projectInfoContainer).toBeVisible();
    
            await expect(projectPage.projectInfo.title).toHaveText('Updated Title');
    
            await signup.cleanup(email, database);
        });
    
        test('user should be able to update the project description', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.description.clear();
            await projectPage.edit.description.fill('Updated description');
            await projectPage.edit.description.blur();
    
            await projectPage.edit.submitButton.click();
            
            await expect(projectPage.projectInfoContainer).toBeVisible();
    
            await expect(projectPage.projectInfo.description).toHaveText('Updated description');
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if the title is empty', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.title.clear();
            await projectPage.edit.title.blur();
    
            await expect(projectPage.edit.titleError).toBeVisible();
            await expect(projectPage.edit.titleError).toHaveText('Title is required.');
            await expect(projectPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if the title is too long', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.title.clear();
            await projectPage.edit.title.fill('a'.repeat(MAX_PROJECT_TITLE_LENGTH + 1));
            await projectPage.edit.title.blur();
    
            await expect(projectPage.edit.titleError).toBeVisible();
            await expect(projectPage.edit.titleError).toHaveText(`Title must be less than ${MAX_PROJECT_TITLE_LENGTH} characters.`);
            await expect(projectPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });

        test('user should not be able to submit the form if the description is too long', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.description.clear();
            await projectPage.edit.description.fill('a'.repeat(MAX_PROJECT_DESCRIPTION_LENGTH + 1));
            await projectPage.edit.description.blur();
    
            await expect(projectPage.edit.descriptionError).toBeVisible();
            await expect(projectPage.edit.descriptionError).toHaveText(`Description must be less than ${MAX_PROJECT_DESCRIPTION_LENGTH} characters.`);
            await expect(projectPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    
        test('user should not be able to submit the form if no changes have been made', async ({ page, viewport, database }) => {
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
            await nav.contextLinks.projects.click({ force: true });
    
            await page.waitForURL('/projects', {waitUntil: 'networkidle'});
    
            await expect(projectsPage.projects).toHaveCount(1);
    
            const [owner] = await database.executeQuery(`SELECT "id" FROM "User" WHERE "email" = '${email}'`);
            const [project] = await database.executeQuery(`SELECT "id" FROM "Project" WHERE "owner_id" = '${owner.id}'`);
    
            projectsPage.projects.nth(0).click();
    
            await page.waitForURL(`/projects/${project.id}`, {waitUntil: 'networkidle'});
    
            const projectPage = new ProjectPageFixture(page, viewport);
    
            await projectPage.projectInfo.editButton.click();
    
            await projectPage.edit.title.clear();
            await projectPage.edit.title.blur();
    
            await projectPage.edit.title.fill(projects[0].title);
            await projectPage.edit.title.blur();
    
            await expect(projectPage.edit.titleError).not.toBeVisible();
    
            await expect(projectPage.edit.submitButton).toBeDisabled();
    
            await signup.cleanup(email, database);
        });
    })
});