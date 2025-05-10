import Link from 'next/link';
import { notFound } from 'next/navigation';
import './page.scss';

type Product = {
  id: number
  title: string
  price: number
  image: string
  category: string
}

// Helper function to slugify the category name
const slugify = (text: string) => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with one
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: {
      revalidate: 3600, // Revalidate every hour since categories don't change often
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function HomePage() {
  try {
    const products = await getProducts();
    const categories = Array.from(new Set(products.map(product => product.category)));

    return (
      <div className="main-page">
        <h1>Product Categories</h1>
        <div className="category-list">
          {categories.map((category) => (
            <div key={category} className="category-card">
              <Link href={`/category/${slugify(category)}`}>
                <h3>{category}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="main-page">
        <h1>Error Loading Categories</h1>
        <p>Sorry, there was an error loading the categories. Please try again later.</p>
      </div>
    );
  }
}
