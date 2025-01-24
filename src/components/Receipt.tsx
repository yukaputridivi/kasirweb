import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  items: ReceiptItem[];
  total: number;
  payment: number;
  change: number;
  onClose: () => void;
}

const Receipt = ({ items, total, payment, change, onClose }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (content) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Receipt</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(content.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div ref={receiptRef} className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold">Struk Pembelian</h2>
            <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
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
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold">Rp. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar:</span>
              <span>Rp. {payment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembali:</span>
              <span>Rp. {change.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">Terima kasih atas kunjungan Anda!</p>
        </div>
        <div className="flex space-x-2 mt-4">
          <Button onClick={handlePrint} className="flex-1">
            Cetak
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Tutup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Receipt;