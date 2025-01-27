import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  payment: number;
  onPaymentChange: (amount: number) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
}

const Cart = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  payment,
  onPaymentChange,
  customerName,
  onCustomerNameChange
}: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const change = payment - total;
  const paymentStatus = payment === total ? "Lunas" : payment < total ? "Dp" : "";

  return (
    <Card className="h-full">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Daftar Pembelian</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Rp. {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                  className="w-20"
                  min="1"
                />
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-bold">Rp. {total.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Label>Bayar:</Label>
            <Input
              type="number"
              value={payment}
              onChange={(e) => onPaymentChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-between">
            <span>Kembali:</span>
            <span className="font-bold">Rp. {change.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <Label>Catatan:</Label>
            <Textarea
              value={paymentStatus}
              readOnly
              className="w-full bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>Nama Pelanggan:</Label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Masukkan nama pelanggan"
              className="w-full"
            />
          </div>
          <Button 
            onClick={onCheckout}
            className="w-full"
            disabled={items.length === 0}
          >
            Simpan & cetak nota
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;