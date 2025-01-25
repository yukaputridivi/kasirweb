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
  searchQuery: string;
}

const ProductList = ({ onAddToCart, searchQuery }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">Rp. {product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
              </div>
              <Button 
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="ml-4"
              >
                Tambah ke Keranjang
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;