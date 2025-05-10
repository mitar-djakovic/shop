'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  productId: number;
  products: any;
};

export default function RemoveFromCartButton({ productId, products }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = async () => {
    await fetch(`https://fakestoreapi.com/carts/1`, {
      method: 'PUT',
      body: {
        id: 1,
        userId: 1,
        products: products.filter((p) => p.id !== productId)
      }
    });

    // Refresh SSR page
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="remove-button"
      title="Remove item"
    >
      🗑️
    </button>
  );
}
