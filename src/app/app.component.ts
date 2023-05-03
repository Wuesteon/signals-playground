import {
  Component,
  signal,
  computed,
  EffectRef,
  effect,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';

// Cart item interface
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Signal for the current cart item
  public cartItemSig = signal<CartItem | null>(null);
  // Injector for the environment
  private injector = inject(EnvironmentInjector);
  // Computed signal for a new cart item
  public newCartItemSig = computed<CartItem>(() => {
    let newCartItem :CartItem= {
      name: 'T-Shirt',
      price: 25,
      quantity: this.cartItemSig()?.quantity || 0,
    };
    return newCartItem;
  });
  // Signal for side effects
  private effectSig!: EffectRef;
  public title = 'angular-signals-cart';

  // Set the current cart item
  public setCartItem(): void {
    this.cartItemSig.set({
      name: 'T-Shirt',
      price: 25,
      quantity: 1,
    });
  }

  // Update the current cart item's quantity
  public updateCartItem(): void {
    this.cartItemSig.update((cartItem) => {
      if (cartItem) cartItem.quantity = cartItem.quantity + 1;
      return cartItem;
    });
  }

  // Mutate the current cart item's quantity
  public mutateCartItem(): void {
    this.cartItemSig.mutate((cartItem) => {
      if (cartItem) {
        cartItem.quantity = 10;
      }
    });
  }

  // Create a side effect for cart item changes
  public createEffect(): void {
    runInInjectionContext(this.injector, () =>
      (this.effectSig = effect(() => {
        alert(
          `side effect angular signal after cart item changes ${JSON.stringify(
            this.cartItemSig()
          )}`
        );
      }))
    );
  }

  // Destroy the side effect
  public destroyEffect(): void {
    this.effectSig?.destroy();
  }
}
