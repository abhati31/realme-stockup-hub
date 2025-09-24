import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Truck, Scan, CheckCircle, Package, Calendar, MapPin } from "lucide-react";

interface DispatchOrdersProps {
  onBack: () => void;
  onComplete: () => void;
}

const DispatchOrders = ({ onBack, onComplete }: DispatchOrdersProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [scannedItems, setScannedItems] = useState<Record<string, boolean>>({});

  const pendingOrders = [
    {
      id: "ORD-2024-001",
      distributor: "Delhi Electronics",
      items: [
        { sku: "RMX-3561", name: "Realme GT 6 - 8GB/256GB", quantity: 5, location: "A1-B2" },
        { sku: "ACC-001", name: "Realme Buds T300", quantity: 10, location: "C3-D4" }
      ],
      totalItems: 15,
      priority: "high",
      orderDate: "2024-12-20",
      deliveryAddress: "Karol Bagh, New Delhi"
    },
    {
      id: "ORD-2024-002",
      distributor: "Mumbai Mobiles",
      items: [
        { sku: "RMX-3562", name: "Realme GT 6 - 12GB/256GB", quantity: 3, location: "A2-B1" },
        { sku: "RMX-3760", name: "Realme 12 Pro+ - 8GB/256GB", quantity: 2, location: "A1-C3" }
      ],
      totalItems: 5,
      priority: "medium",
      orderDate: "2024-12-19",
      deliveryAddress: "Andheri West, Mumbai"
    },
    {
      id: "ORD-2024-003",
      distributor: "Bangalore Tech",
      items: [
        { sku: "ACC-002", name: "Realme Power Bank 10000mAh", quantity: 8, location: "B2-C1" }
      ],
      totalItems: 8,
      priority: "low",
      orderDate: "2024-12-18",
      deliveryAddress: "Koramangala, Bangalore"
    }
  ];

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleItemScanned = (itemKey: string) => {
    setScannedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const selectedOrdersData = pendingOrders.filter(order => selectedOrders.includes(order.id));
  const allItemsScanned = selectedOrdersData.every(order => 
    order.items.every(item => scannedItems[`${order.id}-${item.sku}`])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispatch Orders</h1>
          <p className="text-muted-foreground">
            It's shipping time! Pick and pack these items, scan to confirm, and click 'Dispatch'
          </p>
        </div>
      </div>

      {/* Instructions */}
      <Alert className="border-primary/20 bg-primary/5">
        <Package className="h-4 w-4" />
        <AlertDescription>
          <strong>Dispatch Process:</strong> Select orders → Pick items from locations → 
          Scan each item to confirm → Click 'Mark as Dispatched' when complete
        </AlertDescription>
      </Alert>

      {/* Orders Ready for Dispatch */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Orders Ready for Dispatch ({pendingOrders.length})</h2>
        
        {pendingOrders.map((order) => (
          <Card key={order.id} className={`transition-all duration-200 ${
            selectedOrders.includes(order.id) ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={() => toggleOrderSelection(order.id)}
                  />
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {order.id}
                      <Badge variant={
                        order.priority === 'high' ? 'destructive' : 
                        order.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {order.priority.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {order.distributor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {order.orderDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.deliveryAddress}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{order.totalItems} items</Badge>
              </div>
            </CardHeader>

            {selectedOrders.includes(order.id) && (
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">Pick List:</h4>
                  {order.items.map((item) => {
                    const itemKey = `${order.id}-${item.sku}`;
                    const isScanned = scannedItems[itemKey];
                    
                    return (
                      <div 
                        key={item.sku}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isScanned ? 'bg-green-50 border-green-200' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isScanned}
                            onCheckedChange={() => toggleItemScanned(itemKey)}
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.sku} • Location: {item.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{item.quantity}x</Badge>
                          <Button
                            variant={isScanned ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleItemScanned(itemKey)}
                          >
                            <Scan className="h-4 w-4 mr-1" />
                            {isScanned ? 'Scanned' : 'Scan'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Dispatch Summary */}
      {selectedOrders.length > 0 && (
        <Card className="bg-gradient-to-r from-accent/20 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Dispatch Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrders.length} order(s) selected • 
                  {selectedOrdersData.reduce((sum, order) => sum + order.totalItems, 0)} total items
                </p>
                {!allItemsScanned && selectedOrders.length > 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    Please scan all items before dispatching
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedOrders([])}
                  disabled={selectedOrders.length === 0}
                >
                  Clear Selection
                </Button>
                <Button 
                  onClick={onComplete}
                  disabled={!allItemsScanned || selectedOrders.length === 0}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Dispatched
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DispatchOrders;