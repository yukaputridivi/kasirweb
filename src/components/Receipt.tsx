import React from 'react';
import { Button } from "@/components/ui/button";

interface ReceiptProps {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  payment: number;
  change: number;
  customerName?: string;
  onClose: () => void;
}

const Receipt = ({ items, total, payment, change, customerName, onClose }: ReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="font-bold text-xl">Struk Pembayaran</h2>
        <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
        {customerName && (
          <p className="text-sm">Pelanggan: {customerName}</p>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>Rp. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 space-y-1">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rp. {total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Pembayaran</span>
          <span>Rp. {payment.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian</span>
          <span>Rp. {change.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Terima kasih atas kunjungan Anda</p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button onClick={handlePrint}>Cetak</Button>
        <Button variant="outline" onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
};

export default Receipt;