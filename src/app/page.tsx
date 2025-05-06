import Link from 'next/link';
import './page.scss';
import Header from "../components/Header";

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

export default async function HomePage() {
  const res = await fetch('https://fakestoreapi.com/products')
  const products: Product[] = await res.json()
  const categories = Array.from(new Set(products.map(product => product.category)))

  return (
    <div className="main-page">
      <Header />
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
  )
}
