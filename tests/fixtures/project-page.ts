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
    }

    public edit: {
        title: Locator;
        description: Locator;
        titleError: Locator;
        descriptionError: Locator;
        genError: Locator;
        submitButton: Locator;
        cancelButton: Locator;
    }

    public notes: {
        title: Locator;
        notes: Locator;
    };

    public delete: {
        trigger: Locator;
        modal: Locator;
        header: Locator;
        text: Locator;
        confirmButton: Locator;
        cancelButton: Locator;
    }

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
        }

        this.edit = {
            title: this.editProjectForm.getByTestId('edit-project-title'),
            description: this.editProjectForm.getByTestId('edit-project-description'),
            titleError: this.editProjectForm.getByTestId('title-error'),
            descriptionError: this.editProjectForm.getByTestId('description-error'),
            genError: this.editProjectForm.getByTestId('edit-project-gen-error'),
            submitButton: this.editProjectForm.getByTestId('update-project-button'),
            cancelButton: this.editProjectForm.getByTestId('cancel-edit-project-button'),
        }

        this.notes = {
            title: this.projectNotesContainer.getByTestId('notes-title'),
            notes: this.projectNotesContainer.locator('.note'),
        }

        const deleteModalId = 'delete-project-modal';
        const deleteModal = this.projectInfoContainer.getByTestId(deleteModalId);

        this.delete = {
            trigger: this.projectInfoContainer.getByTestId(`${deleteModalId}-trigger-button`),
            modal: deleteModal,
            header: deleteModal.getByTestId(`${deleteModalId}-content-header`),
            text: deleteModal.getByTestId(`${deleteModalId}-text`),
            confirmButton: deleteModal.getByTestId('delete-project-button'),
            cancelButton: deleteModal.getByTestId('cancel-delete-project-button'),
        }
    }
}