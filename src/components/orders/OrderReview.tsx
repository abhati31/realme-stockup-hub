import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Edit, Trash2, CalendarDays, CreditCard, Truck, CheckCircle } from "lucide-react";

interface OrderItem {
  sku: string;
  quantity: number;
  name: string;
  price: number;
}

interface OrderReviewProps {
  items: OrderItem[];
  onBack: () => void;
  onConfirm: (orderData: { items: OrderItem[]; deliveryDate: string; paymentMethod: string }) => void;
}

const OrderReview = ({ items, onBack, onConfirm }: OrderReviewProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState(items);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter(item => item.sku !== sku));
    } else {
      setOrderItems(orderItems.map(item => 
        item.sku === sku ? { ...item, quantity } : item
      ));
    }
    setEditingItem(null);
  };

  const removeItem = (sku: string) => {
    setOrderItems(orderItems.filter(item => item.sku !== sku));
  };

  const canProceed = orderItems.length > 0 && deliveryDate && paymentMethod;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review & Confirm</h1>
          <p className="text-muted-foreground">
            Everything look correct? You can still edit quantities or remove items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Review your products and quantities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.sku} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm font-medium text-primary">₹{item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingItem === item.sku ? (
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value) || 1)}
                          onBlur={() => setEditingItem(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingItem(null);
                          }}
                          className="w-20"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="cursor-pointer px-3 py-1 border border-border rounded-md min-w-[60px] text-center"
                          onClick={() => setEditingItem(item.sku)}
                        >
                          {item.quantity}
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item.sku)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.sku)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="text-right min-w-[100px]">
                      <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                {orderItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No items in your order. Go back to add products.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Configuration */}
        <div className="space-y-6">
          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery
              </CardTitle>
              <CardDescription>When would you like delivery?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="delivery-date">Preferred Delivery Date</Label>
                  <Input
                    id="delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty for earliest available delivery
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
              <CardDescription>Choose your payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">Bill to credit account</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Pay now</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-gradient-to-br from-card to-accent/10">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>GST (18%):</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => onConfirm({ items: orderItems, deliveryDate, paymentMethod })}
                disabled={!canProceed}
                className="w-full mt-6"
                variant="hero"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Place Order
              </Button>
              
              {!canProceed && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Please select delivery and payment options to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;