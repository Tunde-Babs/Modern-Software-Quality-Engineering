import { randomUUID } from 'node:crypto';
export type ProductId = 'backpack' | 'mug' | 'notebook' | 'lamp';
export type CartItem = { productId: ProductId; quantity: number };
export function cartItem(overrides: Partial<CartItem> = {}): CartItem {
  return { productId: 'mug', quantity: 1, ...overrides };
}
export function practiceLabel(prefix = 'learner'): string { return `${prefix}-${randomUUID()}`; }
