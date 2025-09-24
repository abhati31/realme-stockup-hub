import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, ShoppingCart, Info } from "lucide-react";

interface QuickEntryProps {
  onBack: () => void;
  onProceed: (items: Array<{ sku: string; quantity: number; name: string; price: number }>) => void;
}

const QuickEntry = ({ onBack, onProceed }: QuickEntryProps) => {
  const [items, setItems] = useState([
    { id: 1, sku: '', quantity: 1, name: '', price: 0 }
  ]);

  const addRow = () => {
    setItems([...items, { id: Date.now(), sku: '', quantity: 1, name: '', price: 0 }]);
  };

  const removeRow = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const mockProducts = [
    { sku: 'RMX-3561', name: 'Realme GT 6 - 8GB/256GB', price: 23999 },
    { sku: 'RMX-3562', name: 'Realme GT 6 - 12GB/256GB', price: 26999 },
    { sku: 'RMX-3760', name: 'Realme 12 Pro+ - 8GB/256GB', price: 29999 },
    { sku: 'RMX-3761', name: 'Realme 12 Pro - 8GB/256GB', price: 25999 },
  ];

  const handleSkuChange = (id: number, sku: string) => {
    const product = mockProducts.find(p => p.sku.toLowerCase().includes(sku.toLowerCase()));
    updateItem(id, 'sku', sku);
    if (product) {
      updateItem(id, 'name', product.name);
      updateItem(id, 'price', product.price);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const validItems = items.filter(item => item.sku && item.quantity > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quick Entry</h1>
          <p className="text-muted-foreground">Add products by SKU or product code</p>
        </div>
      </div>

      {/* Help Tip */}
      <Card className="border border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-primary mb-1">Quick Tip</h3>
              <p className="text-sm text-primary/80">
                Start typing a product name or code—we'll suggest matches instantly. 
                Press Tab to move between fields quickly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Product Entry
          </CardTitle>
          <CardDescription>
            Enter SKUs and quantities for your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded-lg font-medium text-sm">
              <div className="col-span-3">SKU / Product Code</div>
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Rows */}
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 p-3 border border-border rounded-lg">
                <div className="col-span-3">
                  <Input
                    value={item.sku}
                    onChange={(e) => handleSkuChange(item.id, e.target.value)}
                    placeholder="Enter SKU..."
                    className="text-sm"
                  />
                </div>
                <div className="col-span-4">
                  <div className="text-sm py-2 px-3 bg-muted rounded-md">
                    {item.name || 'Product will appear here...'}
                  </div>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-sm py-2 px-3 font-medium">
                    {item.price > 0 ? `₹${item.price.toLocaleString()}` : '—'}
                  </div>
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Add Row Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={addRow}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      {validItems.length > 0 && (
        <Card className="bg-gradient-to-r from-accent/20 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Order Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {validItems.length} item(s) • Total: ₹{total.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  Save Draft
                </Button>
                <Button 
                  onClick={() => onProceed(validItems.map(item => ({
                    sku: item.sku,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price
                  })))}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  Review Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickEntry;