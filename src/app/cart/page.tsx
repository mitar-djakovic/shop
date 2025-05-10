import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import './style.scss';
import { incrementFormAction, decrementFormAction } from './actions';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

type CartItem = {
  productId: number;
  quantity: number;
};

// Helper function to fetch the cart data with proper caching
async function getCart(): Promise<CartItem[]> {
  const res = await fetch('https://fakestoreapi.com/carts/1', {
    next: {
      revalidate: 60, // Revalidate every minute
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch cart');
  }

  const cartData = await res.json();
  return cartData.products;
}

// Helper function to fetch product details by productId with proper caching
async function getProductById(productId: number): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`, {
    next: {
      revalidate: 3600, // Revalidate every hour since product data changes less frequently
    },
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch product ${productId}`);
  }
  
  return res.json();
}

// Helper function to fetch all products in parallel
async function getProductsInParallel(cartItems: CartItem[]): Promise<Product[]> {
  const productPromises = cartItems.map((cartItem) => getProductById(cartItem.productId));
  const products = await Promise.all(productPromises);
  
  // Merge product data with cart quantities
  return products.map((product, index) => ({
    ...product,
    quantity: cartItems[index].quantity,
  }));
}

export default async function CartPage() {
  try {
    const cartItems = await getCart();
    const products = await getProductsInParallel(cartItems);

    const totalPrice = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        {products.length > 0 ? (
          <ul className="cart-items">
            {products.map((product) => (
              <li key={product.id} className="cart-item">
                <button className="remove-button" title="Remove item">🗑️</button>
                <div className="cart-item-content">
                  <div className="cart-item-image">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={50}
                      height={50}
                      priority={true}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h2>{product.title}</h2>
                    <p>Price: ${product.price}</p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Total: ${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <form action={incrementFormAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="currentQuantity" value={product.quantity} />
                    <button type="submit">+</button>
                  </form>
                  <form action={decrementFormAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="currentQuantity" value={product.quantity} />
                    <button type="submit">-</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <div className="cart-footer">
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          <Link href="/" className="back-to-home">Back to Home</Link>
        </div>
      </div>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error('Error loading cart:', error);
    return (
      <div className="cart-page">
        <h1>Error Loading Cart</h1>
        <p>Sorry, there was an error loading your cart. Please try again later.</p>
        <Link href="/" className="back-to-home">Back to Home</Link>
      </div>
    );
  }
}
