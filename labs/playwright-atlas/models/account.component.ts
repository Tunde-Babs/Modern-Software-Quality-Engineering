import type { Locator } from '@playwright/test';

export class AccountComponent {
  readonly welcome: Locator;
  readonly error: Locator;
  constructor(readonly root: Locator) {
    this.welcome = root.getByText('Welcome, Alex!', { exact: true });
    this.error = root.getByRole('alert');
  }
  async signIn(email: string, password: string) {
    await this.root.getByLabel('Email', { exact: true }).fill(email);
    await this.root.getByLabel('Password', { exact: true }).fill(password);
    await this.root.getByRole('button', { name: 'Sign in', exact: true }).click();
  }
  async signOut() { await this.root.getByRole('button', { name: 'Sign out', exact: true }).click(); }
}
