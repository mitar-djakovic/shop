'use server';

import { revalidatePath } from 'next/cache';

export async function updateCartItem(productId: number, newQuantity: number) {
  const res = await fetch('https://fakestoreapi.com/carts/1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [{ productId, quantity: newQuantity }]
    }),
  });

  const data = await res.json();
  console.log('API Response:', data);

  if (!res.ok) {
    throw new Error('Failed to update cart');
  }

  revalidatePath('/cart');
  return data;
}

export async function incrementQuantity(productId: number, currentQuantity: number) {
  return await updateCartItem(productId, currentQuantity + 1);
}

export async function decrementQuantity(productId: number, currentQuantity: number) {
  if (currentQuantity > 1) {
    return await updateCartItem(productId, currentQuantity - 1);
  }
}

export async function incrementFormAction(formData: FormData) {
  'use server';
  const productId = Number(formData.get('productId'));
  const currentQuantity = Number(formData.get('currentQuantity'));
  const result = await incrementQuantity(productId, currentQuantity);
  console.log('Increment result:', result);
}

export async function decrementFormAction(formData: FormData) {
  'use server';
  const productId = Number(formData.get('productId'));
  const currentQuantity = Number(formData.get('currentQuantity'));
  const result = await decrementQuantity(productId, currentQuantity);
  console.log('Decrement result:', result);
} 