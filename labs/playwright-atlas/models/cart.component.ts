import type { Locator } from '@playwright/test';

// COM: this object owns only the named cart region, never the whole page.
export class CartComponent {
  readonly total: Locator;
  readonly quantity: Locator;
  constructor(readonly root: Locator) {
    this.total = root.getByLabel('Cart total', { exact: true });
    this.quantity = root.getByLabel('Cart quantity', { exact: true });
  }
  line(productName: string): Locator {
    return this.root.getByRole('listitem', { name: productName, exact: true });
  }
  async remove(productName: string) {
    await this.root.getByRole('button', { name: `Remove ${productName}`, exact: true }).click();
  }
}
