import './style.scss';
import Image from 'next/image';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

const categoryMapping: Record<string, string> = {
  'womens-clothing': "women's clothing",
  'mens-clothing': "men's clothing",
  'electronics': "electronics",
  'jewelery': "jewelery",
};

const unslugify = (slug: string): string => {
  return categoryMapping[slug] || slug; // If not found, return the slug itself
};

// ✅ Make sure the component is async
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getProducts();
  const { slug } = params;

  const category = unslugify(slug);
  const filtered = products.filter((p) => p.category === category);

  return (
    <div className="category-page">
      <h1 className="category-title">{category}</h1>
      <div className="product-list">
        {filtered.map((product) => (
          <div key={product.id} className="product-card">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="product-image"
            />
            <div className="product-details">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
