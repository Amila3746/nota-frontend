'use client';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  offers?: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Strapi Live Endpoint
    fetch('https://nota-backend-production-5dd5.up.railway.app/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading products...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Nota Products List</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: '20px' }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', background: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#000' }}>{item.title}</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>{item.description}</p>
            <p style={{ color: '#000' }}><strong>Price:</strong> LKR {item.price}</p>
            {item.offers && <p style={{ color: 'green' }}><strong>Offer:</strong> LKR {item.offers}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}