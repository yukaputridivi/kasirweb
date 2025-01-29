import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const StoreSettings = () => {
  const [storeName, setStoreName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const storeData = JSON.parse(localStorage.getItem('storeSettings') || '{}');
    setStoreName(storeData.storeName || '');
    setPhoneNumber(storeData.phoneNumber || '');
  }, []);

  const handleUpdate = () => {
    const storeData = {
      storeName,
      phoneNumber
    };
    localStorage.setItem('storeSettings', JSON.stringify(storeData));
    toast.success('Data toko berhasil diperbarui');
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Data Toko</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Toko</Label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Masukkan nama toko"
            />
          </div>
          <div className="space-y-2">
            <Label>No. HP</Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Masukkan nomor HP"
            />
          </div>
          <Button onClick={handleUpdate}>Update Data</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreSettings;