import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleTransaction {
  id: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  payment: number;
  change: number;
}

const SalesJournal = () => {
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(storedTransactions);
  }, []);

  const handleDelete = (id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    
    toast({
      title: "Transaksi berhasil dihapus",
      duration: 2000,
    });
  };

  const handleEdit = (transaction: SaleTransaction) => {
    // For now, we'll just show a toast since editing would require a more complex form
    toast({
      title: "Fitur edit akan segera hadir",
      description: "Mohon maaf, fitur ini sedang dalam pengembangan",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Data Penjualan</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">{transaction.date}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total</span>
                <span className="font-bold">Rp. {transaction.total.toLocaleString()}</span>
              </div>
              <div className="space-y-1">
                {transaction.items.map((item, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>Rp. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t text-sm">
                <div className="flex justify-between">
                  <span>Pembayaran</span>
                  <span>Rp. {transaction.payment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian</span>
                  <span>Rp. {transaction.change.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesJournal;