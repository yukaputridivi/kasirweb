import React, { useState } from 'react';
import ProductInput from '@/components/ProductInput';
import ProductList from '@/components/ProductList';
import Cart from '@/components/Cart';
import Receipt from '@/components/Receipt';
import SalesJournal from '@/components/SalesJournal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const change = payment - total;

    // Save transaction to local storage
    const transaction = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: cartItems,
      total,
      payment,
      change
    };

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    localStorage.setItem('transactions', JSON.stringify([...transactions, transaction]));

    // Update product stock
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.map((product: Product) => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCartItems([]);
    setPayment(0);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container py-6">
      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Kasir</TabsTrigger>
          <TabsTrigger value="products">Input Produk</TabsTrigger>
          <TabsTrigger value="journal">Data Penjualan</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <ProductList onAddToCart={handleAddToCart} />
            </div>
            <div>
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                payment={payment}
                onPaymentChange={setPayment}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductInput />
        </TabsContent>

        <TabsContent value="journal">
          <SalesJournal />
        </TabsContent>
      </Tabs>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <Receipt
            items={cartItems}
            total={total}
            payment={payment}
            change={payment - total}
            onClose={handleCloseReceipt}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;