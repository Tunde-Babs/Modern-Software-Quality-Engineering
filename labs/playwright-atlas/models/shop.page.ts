import { expect, type Page, type Locator } from '@playwright/test';
import { AccountComponent } from './account.component.js';
import { CartComponent } from './cart.component.js';
import { ProductCardComponent } from './product-card.component.js';

// POM: page navigation and composition. Components own their own interaction scope.
export class ShopPage {
  readonly cart: CartComponent;
  readonly account: AccountComponent;
  readonly catalog: Locator;
  constructor(private readonly page: Page) {
    this.cart = new CartComponent(page.getByRole('region', { name: 'Your cart', exact: true }));
    this.account = new AccountComponent(page.getByRole('region', { name: 'Welcome back', exact: true }));
    this.catalog = page.getByRole('region', { name: 'The collection', exact: true });
  }
  async open(url: string) {
    await this.page.goto(url);
    // A readiness condition, not a hidden business-price oracle.
    await expect(this.catalog.getByRole('article')).toHaveCount(4);
  }
  async search(query: string) {
    await this.catalog.getByRole('searchbox', { name: 'Search products', exact: true }).fill(query);
  }
  product(name: string): ProductCardComponent {
    return new ProductCardComponent(this.catalog.getByRole('article', { name, exact: true }));
  }
}
