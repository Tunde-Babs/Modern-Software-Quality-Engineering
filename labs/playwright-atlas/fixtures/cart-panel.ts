import { expect, type Page } from '@playwright/test';
export class CartPanel {
  constructor(private page: Page) {}
  async add(product: string) {
    await this.page.getByRole('article', { name: product, exact: true }).getByRole('button', { name: 'Add to cart', exact: true }).click();
  }
  async remove(product: string) {
    await this.page.getByRole('button', { name: `Remove ${product}`, exact: true }).click();
  }
  async expectSummary(quantity: number, euros: string) {
    await expect(this.page.getByLabel('Cart quantity', { exact: true })).toHaveText(String(quantity));
    await expect(this.page.getByLabel('Cart total', { exact: true })).toHaveText(euros);
  }
}
