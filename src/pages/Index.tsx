import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductInput from '@/components/ProductInput';
import ProductList from '@/components/ProductList';
import Cart from '@/components/Cart';
import Receipt from '@/components/Receipt';
import SalesJournal from '@/components/SalesJournal';
import StoreSettings from '@/components/StoreSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0 });

  useEffect(() => {
    // Calculate localStorage usage
    const calculateStorage = () => {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length + key.length) * 2; // Convert to bytes
        }
      }
      // Convert to MB with 2 decimal places
      const usedMB = (total / (1024 * 1024)).toFixed(2);
      // Maximum localStorage size (usually 5-10MB, we'll use 5MB as a conservative estimate)
      const totalMB = 5;
      setStorageInfo({
        used: parseFloat(usedMB),
        total: totalMB
      });
    };

    calculateStorage();
  }, [cartItems]); // Recalculate when cart changes

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
      change,
      customerName
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
          stock: Math.max(0, product.stock - cartItem.quantity)
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
    setCustomerName('');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Aplikasi Kasir</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <Tabs defaultValue="pos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pos">Kasir</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="journal">Penjualan</TabsTrigger>
          <TabsTrigger value="settings">Toko</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <ProductList onAddToCart={handleAddToCart} searchQuery={searchQuery} />
            </div>
            <div>
              <Cart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                payment={payment}
                onPaymentChange={setPayment}
                customerName={customerName}
                onCustomerNameChange={setCustomerName}
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

        <TabsContent value="settings">
          <div className="space-y-6">
            <StoreSettings />
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Informasi Penyimpanan</h3>
              <div className="space-y-2">
                <p>Penyimpanan Terpakai: {storageInfo.used} MB</p>
                <p>Total Penyimpanan: {storageInfo.total} MB</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {((storageInfo.used / storageInfo.total) * 100).toFixed(1)}% terpakai
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent>
          <Receipt
            items={cartItems}
            total={total}
            payment={payment}
            change={payment - total}
            customerName={customerName}
            onClose={handleCloseReceipt}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;