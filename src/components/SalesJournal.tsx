import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Receipt from './Receipt';

interface SaleTransaction {
  id: string;
  date: string;
  customerName: string;
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
  const [editingTransaction, setEditingTransaction] = useState<SaleTransaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedPayment, setEditedPayment] = useState<number>(0);
  const [editedCustomerName, setEditedCustomerName] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<SaleTransaction | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
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
    setEditingTransaction(transaction);
    setEditedPayment(transaction.payment);
    setEditedCustomerName(transaction.customerName || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    const newChange = editedPayment - editingTransaction.total;
    
    if (editedPayment < editingTransaction.total) {
      toast({
        title: "Pembayaran tidak mencukupi",
        description: "Jumlah pembayaran harus lebih besar atau sama dengan total",
        duration: 2000,
      });
      return;
    }

    const updatedTransaction = {
      ...editingTransaction,
      customerName: editedCustomerName,
      payment: editedPayment,
      change: newChange
    };

    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id ? updatedTransaction : t
    );

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setTransactions(updatedTransactions);
    setIsEditDialogOpen(false);
    setEditingTransaction(null);

    toast({
      title: "Transaksi berhasil diperbarui",
      duration: 2000,
    });
  };

  const handlePrint = (transaction: SaleTransaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptDialogOpen(true);
  };

  const getPaymentStatus = (transaction: SaleTransaction) => {
    return transaction.payment >= transaction.total ? "Lunas" : "DP";
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
                  <Badge variant={getPaymentStatus(transaction) === "Lunas" ? "default" : "secondary"}>
                    {getPaymentStatus(transaction)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePrint(transaction)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
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
                <span className="font-medium">Pelanggan</span>
                <span>{transaction.customerName || "-"}</span>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nama Pelanggan</Label>
                <Input
                  type="text"
                  value={editedCustomerName}
                  onChange={(e) => setEditedCustomerName(e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Pembelian</Label>
                <Input
                  type="text"
                  value={`Rp. ${editingTransaction.total.toLocaleString()}`}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Pembayaran</Label>
                <Input
                  type="number"
                  value={editedPayment}
                  onChange={(e) => setEditedPayment(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Kembalian</Label>
                <Input
                  type="text"
                  value={`Rp. ${(editedPayment - editingTransaction.total).toLocaleString()}`}
                  disabled
                />
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Simpan Perubahan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent>
          {selectedTransaction && (
            <Receipt
              items={selectedTransaction.items}
              total={selectedTransaction.total}
              payment={selectedTransaction.payment}
              change={selectedTransaction.change}
              customerName={selectedTransaction.customerName}
              onClose={() => setIsReceiptDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesJournal;