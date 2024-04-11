import { expect, type Locator, type Page } from "@playwright/test";

export class ToastFixture {
    public toastDialog: Locator;
    public toasts: Locator;

    constructor(
        public readonly page: Page,
    ) {
        
        this.toastDialog = this.page.getByTestId('toast-messages-dialog');
        this.toasts = this.toastDialog.getByTestId('toast-message');
    }

    public async assertToastMessageExists(message: string): Promise<void> {
        await expect(this.toastDialog.getByText(message)).toBeVisible();
    }

    public async closeToastMessage(index: number): Promise<void> {
        const toast = this.toasts.nth(index);
        const closeButton = toast.getByTestId('close-toast-message-button');
        await closeButton.click();
        await expect(closeButton).not.toBeVisible();
    }
}