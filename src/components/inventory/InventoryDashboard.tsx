import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Warehouse, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Package, 
  Truck, 
  BarChart3,
  Plus,
  Upload,
  Send,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";

interface InventoryDashboardProps {
  onReceiveStock: () => void;
  onDispatchOrders: () => void;
  onTransferStock: () => void;
  onViewLowStock: () => void;
}

const InventoryDashboard = ({ 
  onReceiveStock, 
  onDispatchOrders, 
  onTransferStock, 
  onViewLowStock 
}: InventoryDashboardProps) => {
  const lowStockCount = 5;
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-card to-accent/20 rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Warehouse className="h-7 w-7" />
              Welcome to Inventory HQ! 📦
            </h1>
            <p className="text-muted-foreground">
              Here's a quick look at your stock levels. Red means running low—click to see reorder suggestions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onReceiveStock} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Receive New Stock
            </Button>
            <Button onClick={onDispatchOrders} variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Dispatch Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Attention:</span> {lowStockCount} SKUs are below safety stock!{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-destructive hover:text-destructive/80"
              onClick={onViewLowStock}
            >
              Click here to review and reorder.
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45.2M</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dispatches</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Orders ready to ship
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Movement Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top Movers (Last 7 Days)
                </CardTitle>
                <CardDescription>Fast-moving inventory items</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sku: 'RMX-3561', name: 'Realme GT 6 - 8GB/256GB', sold: 142, percentage: 85 },
                { sku: 'RMX-3760', name: 'Realme 12 Pro+ - 8GB/256GB', sold: 98, percentage: 75 },
                { sku: 'ACC-001', name: 'Realme Buds T300', sold: 76, percentage: 60 },
                { sku: 'RMX-3562', name: 'Realme GT 6 - 12GB/256GB', sold: 64, percentage: 50 },
              ].map((item) => (
                <div key={item.sku} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <Badge variant="default">{item.sold} sold</Badge>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Slow Movers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Slow Movers (Last 30 Days)
                </CardTitle>
                <CardDescription>Items with low movement</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { sku: 'ACC-003', name: 'Realme Watch S2', sold: 8, stock: 145, days: 45 },
                { sku: 'ACC-004', name: 'Realme Pad Mini Case', sold: 12, stock: 89, days: 38 },
                { sku: 'RMX-2800', name: 'Realme C55 - 6GB/128GB', sold: 15, stock: 234, days: 32 },
                { sku: 'ACC-005', name: 'Realme Car Charger', sold: 6, stock: 78, days: 28 },
              ].map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.stock} in stock</p>
                    <p className="text-xs text-orange-600">{item.days} days no sale</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common inventory management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={onReceiveStock} variant="outline" className="h-24 flex flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span>Receive Stock</span>
            </Button>
            
            <Button onClick={onDispatchOrders} variant="outline" className="h-24 flex flex-col gap-2">
              <Send className="h-6 w-6" />
              <span>Dispatch Orders</span>
            </Button>
            
            <Button onClick={onTransferStock} variant="outline" className="h-24 flex flex-col gap-2">
              <ArrowUpDown className="h-6 w-6" />
              <span>Transfer Stock</span>
            </Button>
            
            <Button onClick={onViewLowStock} variant="outline" className="h-24 flex flex-col gap-2">
              <AlertCircle className="h-6 w-6" />
              <span>Low Stock Alerts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDashboard;