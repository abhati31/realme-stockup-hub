import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Scan, Upload, Plus, CheckCircle, Info, Package } from "lucide-react";

interface ReceiveStockProps {
  onBack: () => void;
  onComplete: (stockData: any) => void;
}

const ReceiveStock = ({ onBack, onComplete }: ReceiveStockProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'import'>('manual');
  const [stockEntries, setStockEntries] = useState([
    { id: 1, sku: '', quantity: 0, location: 'Mumbai-WH1', batchNumber: '', expiryDate: '' }
  ]);

  const addStockEntry = () => {
    setStockEntries([
      ...stockEntries, 
      { id: Date.now(), sku: '', quantity: 0, location: 'Mumbai-WH1', batchNumber: '', expiryDate: '' }
    ]);
  };

  const updateEntry = (id: number, field: string, value: any) => {
    setStockEntries(stockEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const removeEntry = (id: number) => {
    setStockEntries(stockEntries.filter(entry => entry.id !== id));
  };

  const mockProducts = [
    { sku: 'RMX-3561', name: 'Realme GT 6 - 8GB/256GB', currentStock: 45 },
    { sku: 'RMX-3562', name: 'Realme GT 6 - 12GB/256GB', currentStock: 32 },
    { sku: 'RMX-3760', name: 'Realme 12 Pro+ - 8GB/256GB', currentStock: 28 },
    { sku: 'ACC-001', name: 'Realme Buds T300', currentStock: 120 },
  ];

  const handleSkuChange = (id: number, sku: string) => {
    const product = mockProducts.find(p => p.sku.toLowerCase().includes(sku.toLowerCase()));
    updateEntry(id, 'sku', sku);
  };

  const handleComplete = () => {
    const validEntries = stockEntries.filter(entry => entry.sku && entry.quantity > 0);
    onComplete(validEntries);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receive New Stock</h1>
          <p className="text-muted-foreground">
            Entering new stock? Scan barcode or type the SKU, then add quantity
          </p>
        </div>
      </div>

      {/* Help Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Entry:</strong> For single items, use the manual entry below. 
          <strong> Bulk Import:</strong> For shipments with multiple SKUs, you can import a file.
        </AlertDescription>
      </Alert>

      <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'manual' | 'import')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Import File</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock Entries
              </CardTitle>
              <CardDescription>
                Enter SKU and quantity for each item you're receiving
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded-lg font-medium text-sm">
                  <div className="col-span-3">SKU / Barcode</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Batch Number</div>
                  <div className="col-span-2">Expiry Date</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Entries */}
                {stockEntries.map((entry) => {
                  const product = mockProducts.find(p => p.sku === entry.sku);
                  return (
                    <div key={entry.id} className="space-y-2">
                      <div className="grid grid-cols-12 gap-4 p-3 border border-border rounded-lg">
                        <div className="col-span-3">
                          <div className="relative">
                            <Input
                              value={entry.sku}
                              onChange={(e) => handleSkuChange(entry.id, e.target.value)}
                              placeholder="Scan or type SKU..."
                              className="pr-10"
                            />
                            <Scan className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            value={entry.quantity || ''}
                            onChange={(e) => updateEntry(entry.id, 'quantity', parseInt(e.target.value) || 0)}
                            placeholder="Qty"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={entry.location}
                            onChange={(e) => updateEntry(entry.id, 'location', e.target.value)}
                            placeholder="Location"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={entry.batchNumber}
                            onChange={(e) => updateEntry(entry.id, 'batchNumber', e.target.value)}
                            placeholder="Batch #"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="date"
                            value={entry.expiryDate}
                            onChange={(e) => updateEntry(entry.id, 'expiryDate', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          {stockEntries.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEntry(entry.id)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      {product && (
                        <div className="ml-3 text-sm text-muted-foreground">
                          <span className="font-medium">{product.name}</span>
                          <span className="ml-2">• Current Stock: {product.currentStock} units</span>
                          {entry.quantity > 0 && (
                            <span className="ml-2 text-primary">
                              • New Total: {product.currentStock + entry.quantity} units
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add Entry Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addStockEntry}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Stock File
              </CardTitle>
              <CardDescription>
                Upload CSV or Excel file with your stock data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
                  <p className="text-muted-foreground mb-4">
                    Or click to browse for CSV/Excel files
                  </p>
                  <Button variant="outline">
                    Choose File
                  </Button>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>File Format:</strong> Column 1: SKU, Column 2: Quantity, Column 3: Location (optional), 
                    Column 4: Batch Number (optional), Column 5: Expiry Date (optional)
                  </AlertDescription>
                </Alert>
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
          onClick={handleComplete}
          disabled={!stockEntries.some(entry => entry.sku && entry.quantity > 0)}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Record Stock
        </Button>
      </div>
    </div>
  );
};

export default ReceiveStock;