import Link from 'next/link';
import Image from 'next/image';
import './style.scss';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number; // Quantity of the product in the cart
}

type CartItem = {
  productId: number;
  quantity: number;
}

// Helper function to fetch the cart data
async function getCart(): Promise<CartItem[]> {
  const res = await fetch('https://fakestoreapi.com/carts/1', {
    cache: 'no-store', // Ensures SSR re-fetches every time (disable caching)
  });

  if (!res.ok) throw new Error('Failed to fetch cart');

  const cartData = await res.json();
  return cartData.products; // Returns array of productId and quantity
}

// Helper function to fetch product details by productId
async function getProductById(productId: number): Promise<Product> {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export default async function CartPage() {
  const cartItems = await getCart(); // Fetch the cart data (productId and quantity)

  // Fetch the product details for each cart item
  const products = await Promise.all(
    cartItems.map(async (cartItem) => {
      const product = await getProductById(cartItem.productId);
      return { ...product, quantity: cartItem.quantity };
    })
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {products.length > 0 ? (
        <ul className="cart-items">
          {products.map((product) => (
            <li key={product.id} className="cart-item">
              <div className="cart-item-image">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={50}
                  height={50}
                />
              </div>
              <div className="cart-item-details">
                <h2>{product.title}</h2>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Total: ${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="cart-footer">
        <Link href="/" className="back-to-home">Back to Home</Link>
      </div>
    </div>
  );
}
