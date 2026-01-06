"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

// Types for server actions
interface CreateUserData {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AddToCartData {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface UpdateCartItemData {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CreateAddressData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

// User Management Actions
export async function createOrUpdateUser(userData: CreateUserData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user already exists
    // SECURITY: Use authenticated userId instead of userData.clerkUserId to prevent IDOR
    const existingUser = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (existingUser) {
      // Update existing user
      await client
        .patch(existingUser._id)
        .set({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          lastLogin: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return existingUser._id;
    } else {
      // Create new user
      const newUser = await client.create({
        _type: "user",
        clerkUserId: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        preferences: {
          newsletter: false,
          emailNotifications: true,
          smsNotifications: false,
          preferredCurrency: "USD",
          preferredLanguage: "en",
        },
        cart: [],
        wishlist: [],
        addresses: [],
        orders: [],
        loyaltyPoints: 0,
        totalSpent: 0,
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return newUser._id;
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw new Error("Failed to create or update user");
  }
}

// Cart Management Actions
export async function addToCart(data: AddToCartData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get user document
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Check if item already exists in cart
    const existingCartItem = user.cart?.find(
      (item: any) =>
        item.product._ref === data.productId &&
        item.size === data.size &&
        item.color === data.color
    );

    if (existingCartItem) {
      // Update existing item quantity
      const updatedCart = user.cart.map((item: any) =>
        item.product._ref === data.productId &&
        item.size === data.size &&
        item.color === data.color
          ? { ...item, quantity: item.quantity + data.quantity }
          : item
      );

      await client
        .patch(user._id)
        .set({
          cart: updatedCart,
          updatedAt: new Date().toISOString(),
        })
        .commit();
    } else {
      // Add new item to cart
      const newCartItem = {
        product: {
          _type: "reference",
          _ref: data.productId,
        },
        quantity: data.quantity,
        size: data.size,
        color: data.color,
        addedAt: new Date().toISOString(),
      };

      await client
        .patch(user._id)
        .setIfMissing({ cart: [] })
        .append("cart", [newCartItem])
        .set({ updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart");
  }
}

export async function updateCartItem(data: UpdateCartItemData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const updatedCart = user.cart.map((item: any) =>
      item.product._ref === data.productId &&
      item.size === data.size &&
      item.color === data.color
        ? { ...item, quantity: data.quantity }
        : item
    );

    await client
      .patch(user._id)
      .set({
        cart: updatedCart,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Failed to update cart item");
  }
}

export async function removeFromCart(
  productId: string,
  size?: string,
  color?: string
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const updatedCart = user.cart.filter(
      (item: any) =>
        !(
          item.product._ref === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await client
      .patch(user._id)
      .set({
        cart: updatedCart,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
}

export async function clearCart() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    await client
      .patch(user._id)
      .set({
        cart: [],
        updatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }
}

// Wishlist Management Actions
export async function addToWishlist(productId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Check if product is already in wishlist
    const isInWishlist = user.wishlist?.some(
      (item: any) => item._ref === productId
    );

    if (!isInWishlist) {
      await client
        .patch(user._id)
        .setIfMissing({ wishlist: [] })
        .append("wishlist", [{ _type: "reference", _ref: productId }])
        .set({ updatedAt: new Date().toISOString() })
        .commit();
    }

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add item to wishlist");
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const updatedWishlist =
      user.wishlist?.filter((item: any) => item._ref !== productId) || [];

    await client
      .patch(user._id)
      .set({
        wishlist: updatedWishlist,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    revalidatePath("/wishlist");
    return { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove item from wishlist");
  }
}

// Address Management Actions
export async function createAddress(addressData: CreateAddressData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // If this is set as default, unset all other default addresses
    if (addressData.isDefault) {
      const userAddresses = await client.fetch(
        `*[_type == "address" && user._ref == $userId]`,
        { userId: user._id }
      );

      for (const address of userAddresses) {
        await client.patch(address._id).set({ default: false }).commit();
      }
    }

    // Create new address
    const newAddress = await client.create({
      _type: "address",
      name: addressData.name,
      email: user.email,
      address: addressData.address,
      city: addressData.city,
      state: addressData.state.toUpperCase(),
      zip: addressData.zip,
      default: addressData.isDefault || false,
      user: {
        _type: "reference",
        _ref: user._id,
      },
      createdAt: new Date().toISOString(),
    });

    // Add address reference to user
    await client
      .patch(user._id)
      .setIfMissing({ addresses: [] })
      .append("addresses", [{ _type: "reference", _ref: newAddress._id }])
      .set({ updatedAt: new Date().toISOString() })
      .commit();

    revalidatePath("/cart");
    return { success: true, addressId: newAddress._id };
  } catch (error) {
    console.error("Error creating address:", error);
    throw new Error("Failed to create address");
  }
}

export async function updateAddress(
  addressId: string,
  addressData: CreateAddressData
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // If this is set as default, unset all other default addresses
    if (addressData.isDefault) {
      const user = await client.fetch(
        `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
        { clerkUserId: userId }
      );

      if (user) {
        const userAddresses = await client.fetch(
          `*[_type == "address" && user._ref == $userId && _id != $addressId]`,
          { userId: user._id, addressId }
        );

        for (const address of userAddresses) {
          await client.patch(address._id).set({ default: false }).commit();
        }
      }
    }

    await client
      .patch(addressId)
      .set({
        name: addressData.name,
        address: addressData.address,
        city: addressData.city,
        state: addressData.state.toUpperCase(),
        zip: addressData.zip,
        default: addressData.isDefault || false,
      })
      .commit();

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error("Failed to update address");
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Remove address reference from user
    const updatedAddresses =
      user.addresses?.filter((addr: any) => addr._ref !== addressId) || [];

    await client
      .patch(user._id)
      .set({
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    // Delete the address document
    await client.delete(addressId);

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error deleting address:", error);
    throw new Error("Failed to delete address");
  }
}
