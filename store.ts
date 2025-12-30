import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import _ from "lodash";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  addMultipleItems: (
    products: Array<{ product: Product; quantity: number }>
  ) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getTotalDiscount: () => number;
  getItemCount: (productId: string) => number;
<<<<<<< HEAD
  getTotalItems: () => number;
=======
>>>>>>> origin/main
  getGroupedItems: () => CartItem[];
  // favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  // order placement state
  isPlacingOrder: boolean;
  orderStep: "validating" | "creating" | "emailing" | "redirecting";
  setOrderPlacementState: (
    isPlacing: boolean,
    step?: "validating" | "creating" | "emailing" | "redirecting"
  ) => void;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = _.find(
            state.items,
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: _.map(state.items, (item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      addMultipleItems: (products) =>
        set((state) => {
          let updatedItems = [...state.items];

          _.forEach(products, ({ product, quantity }) => {
            const existingItem = _.find(
              updatedItems,
              (item) => item.product._id === product._id
            );

            if (existingItem) {
              updatedItems = _.map(updatedItems, (item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              updatedItems.push({ product, quantity });
            }
          });

          return { items: updatedItems };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: _.reduce(
            state.items,
            (acc: CartItem[], item) => {
              if (item.product._id === productId) {
                if (item.quantity > 1) {
                  acc.push({ ...item, quantity: item.quantity - 1 });
                }
              } else {
                acc.push(item);
              }
              return acc;
            },
            [] as CartItem[]
          ),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: _.filter(
            state.items,
            ({ product }) => product?._id !== productId
          ),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        // This should be the final payable amount (current/discounted prices)
        return _.reduce(
          get().items,
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      getSubTotalPrice: () => {
        // This should be the gross amount (before discount)
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            const grossPrice = currentPrice + discountAmount;
            return total + grossPrice * item.quantity;
          },
          0
        );
      },
      getTotalDiscount: () => {
        // New function to get total discount amount
        return _.reduce(
          get().items,
          (total, item) => {
            const currentPrice = item.product.price ?? 0;
            const discount = item.product.discount ?? 0;
            const discountAmount = (discount * currentPrice) / 100;
            return total + discountAmount * item.quantity;
          },
          0
        );
      },
      getItemCount: (productId) => {
        const item = _.find(
          get().items,
          (item) => item.product._id === productId
        );
        return item ? item.quantity : 0;
      },
<<<<<<< HEAD
      getTotalItems: () => {
        return _.reduce(
          get().items,
          (total, item) => total + item.quantity,
          0
        );
      },
=======
>>>>>>> origin/main
      getGroupedItems: () => get().items,
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = _.some(
              state.favoriteProduct,
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? _.filter(
                    state.favoriteProduct,
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: _.filter(
            state.favoriteProduct,
            (item) => item?._id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
      // order placement state
      isPlacingOrder: false,
      orderStep: "validating" as const,
      setOrderPlacementState: (isPlacing, step = "validating") => {
        set({
          isPlacingOrder: isPlacing,
          orderStep: step,
        });
      },
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
