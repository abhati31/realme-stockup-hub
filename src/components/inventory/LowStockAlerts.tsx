import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle, Package, TrendingDown, Calendar, ShoppingCart } from "lucide-react";

interface LowStockAlertsProps {
  onBack: () => void;
  onReorder: (items: any[]) => void;
}

const LowStockAlerts = ({ onBack, onReorder }: LowStockAlertsProps) => {
  const [reorderQuantities, setReorderQuantities] = useState<Record<string, number>>({});

  const lowStockItems = [
    {
      sku: 'RMX-3700',
      name: 'Realme 11 Pro - 8GB/256GB',
      currentStock: 8,
      safetyStock: 20,
      averageDailySales: 3.2,
      daysOfCover: 2.5,
      recommendedReorder: 50,
      supplier: 'Realme Manufacturing',
      category: 'Smartphones',
      lastRestock: '2024-11-15',
      status: 'critical'
    },
    {
      sku: 'ACC-006',
      name: 'Realme Watch S Pro',
      currentStock: 12,
      safetyStock: 25,
      averageDailySales: 1.8,
      daysOfCover: 6.7,
      recommendedReorder: 40,
      supplier: 'Realme Accessories',
      category: 'Wearables',
      lastRestock: '2024-12-01',
      status: 'low'
    },
    {
      sku: 'RMX-3800',
      name: 'Realme C67 - 6GB/128GB',
      currentStock: 15,
      safetyStock: 30,
      averageDailySales: 2.1,
      daysOfCover: 7.1,
      recommendedReorder: 60,
      supplier: 'Realme Manufacturing',
      category: 'Smartphones',
      lastRestock: '2024-11-28',
      status: 'low'
    },
    {
      sku: 'ACC-007',
      name: 'Realme Wireless Charger',
      currentStock: 6,
      safetyStock: 15,
      averageDailySales: 1.2,
      daysOfCover: 5.0,
      recommendedReorder: 25,
      supplier: 'Realme Accessories',
      category: 'Accessories',
      lastRestock: '2024-11-20',
      status: 'critical'
    },
    {
      sku: 'RMX-3900',
      name: 'Realme Pad 2 - 8GB/256GB',
      currentStock: 18,
      safetyStock: 35,
      averageDailySales: 0.9,
      daysOfCover: 20.0,
      recommendedReorder: 45,
      supplier: 'Realme Manufacturing',
      category: 'Tablets',
      lastRestock: '2024-10-15',
      status: 'low'
    }
  ];

  const updateReorderQuantity = (sku: string, quantity: number) => {
    setReorderQuantities(prev => ({
      ...prev,
      [sku]: quantity
    }));
  };

  const getStockLevel = (current: number, safety: number) => {
    const percentage = (current / safety) * 100;
    return Math.min(percentage, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'destructive';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const selectedItems = Object.entries(reorderQuantities)
    .filter(([_, quantity]) => quantity > 0)
    .map(([sku, quantity]) => {
      const item = lowStockItems.find(i => i.sku === sku)!;
      return { ...item, reorderQuantity: quantity };
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-destructive" />
            Low Stock Alerts
          </h1>
          <p className="text-muted-foreground">
            {lowStockItems.length} SKUs are below safety stock! Review and set reorder quantities.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Critical Items</p>
                <p className="text-2xl font-bold text-destructive">
                  {lowStockItems.filter(item => item.status === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">
                  {lowStockItems.filter(item => item.status === 'low').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Value at Risk</p>
                <p className="text-2xl font-bold text-primary">₹2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Items */}
      <div className="space-y-4">
        {lowStockItems.map((item) => (
          <Card key={item.sku} className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {item.name}
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>SKU: {item.sku}</span>
                    <span>Category: {item.category}</span>
                    <span>Supplier: {item.supplier}</span>
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.daysOfCover.toFixed(1)} days cover
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Information */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Stock</span>
                      <span className="font-medium">{item.currentStock} / {item.safetyStock}</span>
                    </div>
                    <Progress 
                      value={getStockLevel(item.currentStock, item.safetyStock)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Daily Sales</p>
                      <p className="font-medium">{item.averageDailySales}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Restock</p>
                      <p className="font-medium">{item.lastRestock}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="space-y-3">
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-1">Recommended Order</p>
                    <p className="text-2xl font-bold">{item.recommendedReorder} units</p>
                    <p className="text-xs text-muted-foreground">
                      Will provide ~{Math.round(item.recommendedReorder / item.averageDailySales)} days of cover
                    </p>
                  </div>
                </div>

                {/* Reorder Controls */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Reorder Quantity</label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        min="0"
                        value={reorderQuantities[item.sku] || item.recommendedReorder}
                        onChange={(e) => updateReorderQuantity(item.sku, parseInt(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReorderQuantity(item.sku, item.recommendedReorder)}
                      >
                        Use Recommended
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant={reorderQuantities[item.sku] > 0 ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const quantity = reorderQuantities[item.sku] || item.recommendedReorder;
                      updateReorderQuantity(item.sku, quantity > 0 ? quantity : item.recommendedReorder);
                    }}
                  >
                    {reorderQuantities[item.sku] > 0 ? 'Added to Reorder' : 'Add to Reorder'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reorder Summary */}
      {selectedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-accent/20 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Reorder Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedItems.length} item(s) selected for reorder • 
                  Total: {selectedItems.reduce((sum, item) => sum + item.reorderQuantity, 0)} units
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setReorderQuantities({})}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={() => onReorder(selectedItems)}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Reorder ({selectedItems.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LowStockAlerts;