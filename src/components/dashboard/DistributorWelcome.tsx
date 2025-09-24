import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Package, TrendingUp } from "lucide-react";

const DistributorWelcome = ({ onStartNewOrder }: { onStartNewOrder: () => void }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-card to-accent/20 rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Hello, Rajesh Kumar! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to stock up? Create a new order or check on past orders—it's all here.
            </p>
          </div>
          <Button 
            onClick={onStartNewOrder}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start New Order
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 in processing, 1 shipped
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,45,000</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Expected this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "#ORD-2024-001", status: "Shipped", amount: "₹45,000", date: "Dec 20, 2024" },
              { id: "#ORD-2024-002", status: "Processing", amount: "₹32,500", date: "Dec 19, 2024" },
              { id: "#ORD-2024-003", status: "Delivered", amount: "₹67,800", date: "Dec 18, 2024" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"}
                  >
                    {order.status}
                  </Badge>
                  <p className="font-medium">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorWelcome;