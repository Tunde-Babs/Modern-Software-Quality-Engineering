import type { Locator } from '@playwright/test';

export class ProductCardComponent {
  constructor(readonly root: Locator) {}
  async addToCart() {
    await this.root.getByRole('button', { name: 'Add to cart', exact: true }).click();
  }
}
