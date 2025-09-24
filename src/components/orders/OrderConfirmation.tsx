import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, MapPin, Calendar, Home } from "lucide-react";

interface OrderConfirmationProps {
  orderNumber: string;
  onGoHome: () => void;
  onTrackOrder: () => void;
}

const OrderConfirmation = ({ orderNumber, onGoHome, onTrackOrder }: OrderConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="text-center bg-gradient-to-br from-green-50 to-primary/5 border-green-200">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-4">
            Thanks, Rajesh Kumar! Your order {orderNumber} is confirmed. 
            You can track its progress anytime.
          </p>
          <Badge variant="default" className="text-sm">
            Order {orderNumber}
          </Badge>
        </CardContent>
      </Card>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Status Timeline
          </CardTitle>
          <CardDescription>
            Track your order progress in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                icon: CheckCircle, 
                title: "Order Confirmed", 
                description: "Your order has been received and confirmed",
                status: "completed",
                time: "Just now"
              },
              { 
                icon: Package, 
                title: "Waiting for Approval", 
                description: "Our team is reviewing your order details",
                status: "current",
                time: "Within 2 hours"
              },
              { 
                icon: Package, 
                title: "Packing", 
                description: "Items are being packed for shipment",
                status: "pending",
                time: "Next step"
              },
              { 
                icon: Truck, 
                title: "Shipped", 
                description: "Your order is on its way",
                status: "pending",
                time: "Then"
              },
              { 
                icon: MapPin, 
                title: "Delivered", 
                description: "Order delivered to your location",
                status: "pending",
                time: "Finally"
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : step.status === 'current'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      step.status === 'completed' ? 'text-green-700' : ''
                    }`}>
                      {step.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Order Review</p>
                <p className="text-sm text-muted-foreground">
                  Our sales team will review your order within 2 hours
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Processing & Packing</p>
                <p className="text-sm text-muted-foreground">
                  Once approved, we'll pack your items and generate shipping labels
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Shipment & Delivery</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onTrackOrder} variant="default" className="flex-1">
          Track This Order
        </Button>
        <Button onClick={onGoHome} variant="outline" className="flex-1">
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;