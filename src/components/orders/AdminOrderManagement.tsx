import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Filter, RefreshCw, Search, Ship, CheckCircle2, PackageCheck } from "lucide-react";

type Channel = "Distributor" | "Online Store";
type Status = "New" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Completed" | "Approval Required";

interface OrderLineItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: string;
  channel: Channel;
  customer: string; // distributor name or consumer name
  date: string; // ISO date
  status: Status;
  paymentStatus: "Paid" | "Pending" | "COD" | "On Account";
  total: number;
  items: OrderLineItem[];
  trackingNumber?: string;
}

const initialOrders: OrderRecord[] = [
  // Distributor - Approval required (credit/quota)
  {
    id: "ORD-0001",
    channel: "Distributor",
    customer: "Sharma Distributors",
    date: new Date().toISOString(),
    status: "Approval Required",
    paymentStatus: "On Account",
    total: 245000,
    items: [
      { sku: "RMX-3561", name: "Realme GT 6 - 8GB/256GB", quantity: 20, price: 23999 },
      { sku: "ACC-001", name: "Realme Buds T300", quantity: 50, price: 2299 },
    ],
  },
  // Distributor - New (just submitted)
  {
    id: "ORD-0002",
    channel: "Distributor",
    customer: "Eastern Mobile Hub",
    date: new Date().toISOString(),
    status: "New",
    paymentStatus: "On Account",
    total: 98500,
    items: [
      { sku: "RMX-3760", name: "Realme 12 Pro+ - 8GB/256GB", quantity: 3, price: 29999 },
      { sku: "ACC-002", name: "Realme Power Bank 10000mAh", quantity: 30, price: 1499 },
    ],
  },
  // Online - Processing (paid, ready for pick/pack)
  {
    id: "ORD-0003",
    channel: "Online Store",
    customer: "Anita Verma",
    date: new Date().toISOString(),
    status: "Processing",
    paymentStatus: "Paid",
    total: 25999,
    items: [{ sku: "RMX-3761", name: "Realme 12 Pro - 8GB/256GB", quantity: 1, price: 25999 }],
  },
  // Distributor - Packed
  {
    id: "ORD-0004",
    channel: "Distributor",
    customer: "SouthTech Wholesale",
    date: new Date().toISOString(),
    status: "Packed",
    paymentStatus: "On Account",
    total: 178500,
    items: [
      { sku: "RMX-3562", name: "Realme GT 6 - 12GB/256GB", quantity: 5, price: 26999 },
      { sku: "ACC-002", name: "Realme Power Bank 10000mAh", quantity: 100, price: 1499 },
    ],
  },
  // Online - Shipped (with tracking)
  {
    id: "ORD-0005",
    channel: "Online Store",
    customer: "Rahul Nair",
    date: new Date().toISOString(),
    status: "Shipped",
    paymentStatus: "Paid",
    total: 2299,
    trackingNumber: "TRK-582194",
    items: [{ sku: "ACC-001", name: "Realme Buds T300", quantity: 1, price: 2299 }],
  },
  // Distributor - Delivered
  {
    id: "ORD-0006",
    channel: "Distributor",
    customer: "Metro Teleshop",
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    status: "Delivered",
    paymentStatus: "On Account",
    total: 539980,
    trackingNumber: "TRK-114455",
    items: [
      { sku: "RMX-3561", name: "Realme GT 6 - 8GB/256GB", quantity: 20, price: 23999 },
      { sku: "RMX-3761", name: "Realme 12 Pro - 8GB/256GB", quantity: 2, price: 25999 },
    ],
  },
  // Online - Completed
  {
    id: "ORD-0007",
    channel: "Online Store",
    customer: "Pooja Sahu",
    date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    status: "Completed",
    paymentStatus: "Paid",
    total: 1499,
    trackingNumber: "TRK-991230",
    items: [{ sku: "ACC-002", name: "Realme Power Bank 10000mAh", quantity: 1, price: 1499 }],
  },
];

const statusColors: Record<Status, "secondary" | "default" | "destructive" | "outline"> = {
  "New": "secondary",
  "Processing": "default",
  "Packed": "secondary",
  "Shipped": "default",
  "Delivered": "secondary",
  "Completed": "default",
  "Approval Required": "destructive",
};

const currency = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = query.toLowerCase();
      const matchesQ = !q || [o.id, o.customer, o.items.map(i => i.sku).join(","), o.items.map(i => i.name).join(",")].some((f) => f.toLowerCase().includes(q));
      const matchesChannel = channel === "all" || o.channel === channel;
      const matchesStatus = status === "all" || o.status === status;
      return matchesQ && matchesChannel && matchesStatus;
    });
  }, [orders, query, channel, status]);

  const setOrderStatus = (id: string, newStatus: Status, extra?: Partial<OrderRecord>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus, ...extra } : o)));
  };

  const approveOrder = (o: OrderRecord) => setOrderStatus(o.id, "Processing");
  const markPacked = (o: OrderRecord) => setOrderStatus(o.id, "Packed");
  const markShipped = (o: OrderRecord) => setOrderStatus(o.id, "Shipped", { trackingNumber: `TRK-${Math.floor(Math.random() * 1_000_000)}` });
  const markDelivered = (o: OrderRecord) => setOrderStatus(o.id, "Delivered");
  const markCompleted = (o: OrderRecord) => setOrderStatus(o.id, "Completed");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by ID, customer, SKU..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="Distributor">Distributor</SelectItem>
                <SelectItem value="Online Store">Online Store</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(["New","Processing","Packed","Shipped","Delivered","Completed","Approval Required"] as Status[]).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Orders ({filtered.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.channel}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{new Date(o.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[o.status]}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{currency(o.total)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Details</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order {o.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div><span className="text-muted-foreground">Channel:</span> {o.channel}</div>
                              <div><span className="text-muted-foreground">Customer:</span> {o.customer}</div>
                              <div><span className="text-muted-foreground">Payment:</span> {o.paymentStatus}</div>
                            </div>
                            <div className="text-right">
                              <div><span className="text-muted-foreground">Date:</span> {new Date(o.date).toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Total:</span> {currency(o.total)}</div>
                              {o.trackingNumber && (
                                <div><span className="text-muted-foreground">Tracking:</span> {o.trackingNumber}</div>
                              )}
                            </div>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {o.items.map((it) => (
                                <TableRow key={it.sku}>
                                  <TableCell>{it.sku}</TableCell>
                                  <TableCell>{it.name}</TableCell>
                                  <TableCell>{it.quantity}</TableCell>
                                  <TableCell className="text-right">{currency(it.price)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                          <div className="flex flex-wrap gap-2 justify-end">
                            {o.status === "Approval Required" && (
                              <Button size="sm" onClick={() => approveOrder(o)}><CheckCircle2 className="h-4 w-4 mr-2" />Approve</Button>
                            )}
                            {o.status === "Processing" && (
                              <Button size="sm" onClick={() => markPacked(o)}><PackageCheck className="h-4 w-4 mr-2" />Mark Packed</Button>
                            )}
                            {o.status === "Packed" && (
                              <Button size="sm" onClick={() => markShipped(o)}><Ship className="h-4 w-4 mr-2" />Mark Shipped</Button>
                            )}
                            {o.status === "Shipped" && (
                              <Button size="sm" variant="outline" onClick={() => markDelivered(o)}>Mark Delivered</Button>
                            )}
                            {o.status === "Delivered" && (
                              <Button size="sm" variant="outline" onClick={() => markCompleted(o)}>Complete</Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderManagement;


