import type { Locator, Page, ViewportSize } from "@playwright/test";

export class ProjectPageFixture {
    public projectInfoContainer: Locator;
    public editProjectForm: Locator;
    public projectNotesContainer: Locator;

    public projectInfo: {
        title: Locator;
        description: Locator;
        backToProjectsLink: Locator;
        editButton: Locator;
        completeButton: Locator;
        deleteButton: Locator;
    }

    public edit: {
        title: Locator;
        description: Locator;
        submitButton: Locator;
        cancelButton: Locator;
    }

    public notes: {
        title: Locator;
        notes: Locator;
    };

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.projectInfoContainer = this.page.getByTestId('project-info-container');
        this.editProjectForm = this.page.getByTestId('edit-project-form');
        this.projectNotesContainer = this.page.getByTestId('project-notes-container');

        this.projectInfo = {
            title: this.projectInfoContainer.getByTestId('title'),
            description: this.projectInfoContainer.getByTestId('description'),
            backToProjectsLink: this.projectInfoContainer.getByTestId('back-to-projects-link'),
            editButton: this.projectInfoContainer.getByTestId('edit-project-button'),
            completeButton: this.projectInfoContainer.getByTestId('complete-project-button'),
            deleteButton: this.projectInfoContainer.getByTestId('delete-project-button'),
        }

        this.edit = {
            title: this.editProjectForm.getByTestId('edit-project-title'),
            description: this.editProjectForm.getByTestId('edit-project-description'),
            submitButton: this.editProjectForm.getByTestId('update-project-button'),
            cancelButton: this.editProjectForm.getByTestId('cancel-edit-project-button'),
        }

        this.notes = {
            title: this.projectNotesContainer.getByTestId('notes-title'),
            notes: this.projectNotesContainer.locator('.note'),
        }
    }
}