import type { Locator, Page, ViewportSize } from "@playwright/test";

export class TaskPageFixture {
    public taskInfoContainer: Locator;
    public editTaskForm: Locator;
    public taskNotesContainer: Locator;

    public taskInfo: {
        backLink: Locator;
        editButton: Locator;
        completeButton: Locator;
        status: Locator;
        title: Locator;
        description: Locator;
        descriptionPreview: Locator;
    }

    public edit: {
        title: Locator;
        description: Locator;
        descriptionPreview: Locator;
        context: Locator;
        contextTrigger: Locator;
        contextValue: Locator;
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

    public convertToProject: {
        trigger: Locator;
        modal: Locator;
        header: Locator;
        text: Locator;
        confirmButton: Locator;
        cancelButton: Locator;
    }

    constructor(public readonly page: Page, public readonly viewport?: ViewportSize | null) {
        this.taskInfoContainer = this.page.getByTestId('task-info-container');
        this.editTaskForm = this.page.getByTestId('edit-task-form');
        this.taskNotesContainer = this.page.getByTestId('task-notes-container');

        this.taskInfo = {
            backLink: this.taskInfoContainer.getByTestId('back-to-tasks-link'),
            editButton: this.taskInfoContainer.getByTestId('edit-task-button'),
            completeButton: this.taskInfoContainer.getByTestId('complete-task-button'),
            status: this.taskInfoContainer.getByTestId('task-status'),
            title: this.taskInfoContainer.getByTestId('title'),
            description: this.taskInfoContainer.getByTestId('description'),
            descriptionPreview: this.taskInfoContainer.getByTestId('description-preview'),
        }

        const contextContainer = this.editTaskForm.locator('#context-container');

        this.edit = {
            title: this.editTaskForm.getByTestId('edit-task-title'),
            description: this.editTaskForm.getByTestId('edit-task-description'),
            descriptionPreview: this.editTaskForm.getByTestId('edit-task-description'),
            context: contextContainer,
            contextTrigger: contextContainer.locator('#context'),
            contextValue: contextContainer.locator('[name="contextId"]'),
            titleError: this.editTaskForm.getByTestId('title-error'),
            descriptionError: this.editTaskForm.getByTestId('description-error'),
            genError: this.editTaskForm.getByTestId('edit-task-gen-error'),
            submitButton: this.editTaskForm.getByTestId('update-task-button'),
            cancelButton: this.editTaskForm.getByTestId('cancel-edit-task-button'),
        }

        this.notes = {
            title: this.taskNotesContainer.getByTestId('notes-title'),
            notes: this.taskNotesContainer.locator('.note'),
        }

        const deleteModalId = 'delete-task-modal';
        const deleteModal = this.taskInfoContainer.getByTestId(deleteModalId);

        this.delete = {
            trigger: this.taskInfoContainer.getByTestId(`${deleteModalId}-trigger-button`),
            modal: deleteModal,
            header: deleteModal.getByTestId(`${deleteModalId}-content-header`),
            text: deleteModal.getByTestId(`${deleteModalId}-text`),
            confirmButton: deleteModal.getByTestId('delete-task-button'),
            cancelButton: deleteModal.getByTestId('cancel-delete-task-button'),
        }

        const convertTaskToProjectModalId = 'convert-task-to-project';
        const convertTaskToProjectModal = this.page.getByTestId(`${convertTaskToProjectModalId}-modal`);
        
        this.convertToProject = {
            trigger: this.taskInfoContainer.getByTestId(`${convertTaskToProjectModalId}-trigger-button`),
            modal: convertTaskToProjectModal,
            header: convertTaskToProjectModal.getByTestId(`${convertTaskToProjectModalId}-modal-header`),
            text: convertTaskToProjectModal.getByTestId(`${convertTaskToProjectModalId}-modal-message`),
            confirmButton: convertTaskToProjectModal.getByTestId(`${convertTaskToProjectModalId}-submit`),
            cancelButton: convertTaskToProjectModal.getByTestId(`cancel-${convertTaskToProjectModalId}`),
        }
    }
}