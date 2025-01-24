import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const ProductInput = () => {
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    stock: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProduct = { ...product, id: Date.now().toString() };
    localStorage.setItem('products', JSON.stringify([...products, newProduct]));
    setProduct({ id: '', name: '', price: 0, stock: 0 });
    toast.success('Produk berhasil ditambahkan');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Harga</Label>
        <Input
          id="price"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stok</Label>
        <Input
          id="stock"
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          required
        />
      </div>
      <Button type="submit" className="w-full">Tambah Produk</Button>
    </form>
  );
};

export default ProductInput;