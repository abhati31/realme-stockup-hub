import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowUpDown, Edit, AlertTriangle, CheckCircle, Building } from "lucide-react";

interface TransferStockProps {
  onBack: () => void;
  onComplete: () => void;
}

const TransferStock = ({ onBack, onComplete }: TransferStockProps) => {
  const [transferType, setTransferType] = useState<'transfer' | 'adjustment'>('transfer');
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [reason, setReason] = useState('');
  const [transferItems, setTransferItems] = useState([
    { id: 1, sku: '', quantity: 0, availableStock: 0 }
  ]);

  const locations = [
    { id: 'mumbai-wh1', name: 'Mumbai Warehouse 1', address: 'Andheri East, Mumbai' },
    { id: 'delhi-wh1', name: 'Delhi Warehouse 1', address: 'Gurgaon, Delhi NCR' },
    { id: 'bangalore-wh1', name: 'Bangalore Warehouse 1', address: 'Electronic City, Bangalore' },
    { id: 'chennai-wh1', name: 'Chennai Warehouse 1', address: 'OMR, Chennai' }
  ];

  const adjustmentReasons = [
    'Physical count variance',
    'Damaged goods',
    'Expired products',
    'System error correction',
    'Quality control rejection',
    'Lost in transit',
    'Other'
  ];

  const mockProducts = [
    { sku: 'RMX-3561', name: 'Realme GT 6 - 8GB/256GB', stock: 45 },
    { sku: 'RMX-3562', name: 'Realme GT 6 - 12GB/256GB', stock: 32 },
    { sku: 'RMX-3760', name: 'Realme 12 Pro+ - 8GB/256GB', stock: 28 },
    { sku: 'ACC-001', name: 'Realme Buds T300', stock: 120 },
  ];

  const addTransferItem = () => {
    setTransferItems([
      ...transferItems,
      { id: Date.now(), sku: '', quantity: 0, availableStock: 0 }
    ]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    setTransferItems(transferItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSkuChange = (id: number, sku: string) => {
    const product = mockProducts.find(p => p.sku === sku);
    updateItem(id, 'sku', sku);
    if (product) {
      updateItem(id, 'availableStock', product.stock);
    }
  };

  const canSubmit = transferType === 'transfer' 
    ? sourceLocation && destinationLocation && transferItems.some(item => item.sku && item.quantity > 0)
    : reason && transferItems.some(item => item.sku && item.quantity !== 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transfers & Adjustments</h1>
          <p className="text-muted-foreground">
            Move items between warehouses or correct inventory discrepancies
          </p>
        </div>
      </div>

      <Tabs value={transferType} onValueChange={(value) => setTransferType(value as 'transfer' | 'adjustment')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transfer">Stock Transfer</TabsTrigger>
          <TabsTrigger value="adjustment">Inventory Adjustment</TabsTrigger>
        </TabsList>

        <TabsContent value="transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Stock Transfer
              </CardTitle>
              <CardDescription>
                Need to move items between warehouses? Choose the source and destination, then confirm the SKUs and quantities.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">From Location</Label>
                  <Select value={sourceLocation} onValueChange={setSourceLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.address}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="destination">To Location</Label>
                  <Select value={destinationLocation} onValueChange={setDestinationLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.filter(loc => loc.id !== sourceLocation).map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.address}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transfer Items */}
              <div className="space-y-4">
                <Label>Items to Transfer</Label>
                
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded-lg font-medium text-sm">
                  <div className="col-span-4">SKU</div>
                  <div className="col-span-3">Available Stock</div>
                  <div className="col-span-3">Transfer Quantity</div>
                  <div className="col-span-2">Action</div>
                </div>

                {transferItems.map((item) => {
                  const product = mockProducts.find(p => p.sku === item.sku);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border border-border rounded-lg">
                      <div className="col-span-4">
                        <Input
                          value={item.sku}
                          onChange={(e) => handleSkuChange(item.id, e.target.value)}
                          placeholder="Enter SKU..."
                        />
                        {product && (
                          <p className="text-xs text-muted-foreground mt-1">{product.name}</p>
                        )}
                      </div>
                      <div className="col-span-3">
                        <div className="py-2 px-3">
                          <Badge variant="outline">{item.availableStock} units</Badge>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="1"
                          max={item.availableStock}
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="Quantity"
                        />
                      </div>
                      <div className="col-span-2">
                        {transferItems.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTransferItems(transferItems.filter(i => i.id !== item.id))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <Button variant="outline" onClick={addTransferItem} className="w-full border-dashed">
                  Add Another Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Inventory Adjustment
              </CardTitle>
              <CardDescription>
                Correct inventory discrepancies carefully. Please provide a brief reason—this helps us audit later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Reason Selection */}
              <div>
                <Label htmlFor="reason">Adjustment Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for adjustment" />
                  </SelectTrigger>
                  <SelectContent>
                    {adjustmentReasons.map((reasonOption) => (
                      <SelectItem key={reasonOption} value={reasonOption}>
                        {reasonOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  placeholder="Provide additional details about the adjustment..."
                  className="mt-1"
                />
              </div>

              {/* Adjustment Items */}
              <div className="space-y-4">
                <Label>Items to Adjust</Label>
                
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded-lg font-medium text-sm">
                  <div className="col-span-4">SKU</div>
                  <div className="col-span-3">Current Stock</div>
                  <div className="col-span-3">Adjustment (+/-)</div>
                  <div className="col-span-2">New Total</div>
                </div>

                {transferItems.map((item) => {
                  const product = mockProducts.find(p => p.sku === item.sku);
                  const newTotal = item.availableStock + (item.quantity || 0);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border border-border rounded-lg">
                      <div className="col-span-4">
                        <Input
                          value={item.sku}
                          onChange={(e) => handleSkuChange(item.id, e.target.value)}
                          placeholder="Enter SKU..."
                        />
                        {product && (
                          <p className="text-xs text-muted-foreground mt-1">{product.name}</p>
                        )}
                      </div>
                      <div className="col-span-3">
                        <div className="py-2 px-3">
                          <Badge variant="outline">{item.availableStock} units</Badge>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          placeholder="+/- Quantity"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="py-2 px-3">
                          <Badge variant={newTotal < 0 ? "destructive" : "default"}>
                            {newTotal} units
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button variant="outline" onClick={addTransferItem} className="w-full border-dashed">
                  Add Another Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>
          Cancel
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!canSubmit}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {transferType === 'transfer' ? 'Confirm Transfer' : 'Apply Adjustment'}
        </Button>
      </div>
    </div>
  );
};

export default TransferStock;