import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(storedTransactions);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Data Penjualan</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">{transaction.date}</span>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesJournal;