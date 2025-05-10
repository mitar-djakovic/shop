import Image from 'next/image';
import { notFound } from 'next/navigation';
import './style.scss';

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: {
      revalidate: 3600, // Revalidate every hour
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

const categoryMapping: Record<string, string> = {
  'womens-clothing': "women's clothing",
  'mens-clothing': "men's clothing",
  'electronics': "electronics",
  'jewelery': "jewelery",
};

const unslugify = (slug: string): string => {
  return categoryMapping[slug] || slug; // If not found, return the slug itself
};

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    const products = await getProducts();
    const { slug } = params;
    const category = unslugify(slug);
    
    // Validate if the category exists
    const validCategories = Array.from(new Set(products.map(p => p.category)));
    if (!validCategories.includes(category)) {
      notFound();
    }

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
                priority={true} // Prioritize loading of visible images
                loading="eager"
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
  } catch (error) {
    console.error('Error loading category:', error);
    return (
      <div className="category-page">
        <h1 className="category-title">Error Loading Category</h1>
        <p>Sorry, there was an error loading the category. Please try again later.</p>
      </div>
    );
  }
}
