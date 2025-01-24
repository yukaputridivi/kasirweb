import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList = ({ onAddToCart }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">Rp. {product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Stok: {product.stock}</p>
            <Button 
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="mt-2 w-full"
            >
              Tambah ke Keranjang
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;