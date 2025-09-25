import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, RefreshCw, Search } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#06b6d4", "#8b5cf6"]; // tailwind palette

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const salesByMonth = months.map((m, i) => ({
  month: m,
  revenue: 20 + Math.round(Math.sin(i/2)*8) + i, // mock
  orders: 200 + i * 10,
  b2b: 12 + Math.max(0, Math.round(Math.cos(i/3)*5)) + i * 0.3,
  b2c: 8 + Math.max(0, Math.round(Math.sin(i/3)*5)),
}));

const salesByRegion = [
  { name: "Delhi NCR", value: 26 },
  { name: "Mumbai", value: 24 },
  { name: "Bangalore", value: 18 },
  { name: "Chennai", value: 14 },
  { name: "Kolkata", value: 10 },
  { name: "Hyderabad", value: 8 },
];

const distributorPerf = [
  { name: "Mumbai Electronics", sales: 65, orders: 820, onTime: 96, returns: 2.1 },
  { name: "Sharma Distributors", sales: 41, orders: 540, onTime: 93, returns: 2.7 },
  { name: "SouthTech Wholesale", sales: 18, orders: 220, onTime: 91, returns: 1.2 },
  { name: "EastWave Traders", sales: 23, orders: 290, onTime: 95, returns: 1.8 },
];

const invKpis = [
  { sku: "RMX-3561", turnover: 9.2, daysCover: 24 },
  { sku: "ACC-001", turnover: 12.5, daysCover: 18 },
  { sku: "RMX-3761", turnover: 7.1, daysCover: 31 },
  { sku: "RMX-2800", turnover: 4.8, daysCover: 46 },
];

const fulfillMetrics = [
  { day: "Mon", processingHrs: 6.2, sla: 92, backorder: 1.8, returns: 1.1 },
  { day: "Tue", processingHrs: 6.8, sla: 91, backorder: 1.9, returns: 1.0 },
  { day: "Wed", processingHrs: 5.9, sla: 95, backorder: 1.1, returns: 0.9 },
  { day: "Thu", processingHrs: 6.0, sla: 94, backorder: 1.2, returns: 1.0 },
  { day: "Fri", processingHrs: 5.7, sla: 96, backorder: 0.9, returns: 0.8 },
  { day: "Sat", processingHrs: 6.1, sla: 93, backorder: 1.5, returns: 1.0 },
  { day: "Sun", processingHrs: 6.4, sla: 92, backorder: 1.7, returns: 1.3 },
];

const SalesAnalytics = () => {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [channel, setChannel] = useState("all");
  const [range, setRange] = useState("QTD");
  const [activeTab, setActiveTab] = useState("overall");

  const summary = useMemo(() => {
    const totalRevenue = salesByMonth.reduce((s, r) => s + r.revenue, 0);
    const totalOrders = salesByMonth.reduce((s, r) => s + r.orders, 0);
    const yoy = 12; // mock YoY growth
    return { totalRevenue, totalOrders, yoy };
  }, []);

  const exportCsv = () => {
    // choose dataset based on active tab and current filters (mock filtering)
    let rows: any[] = [];
    if (activeTab === "overall") {
      rows = salesByRegion.map(r => ({ Region: r.name, SharePercent: r.value }));
    } else if (activeTab === "distributors") {
      rows = distributorPerf.map(d => ({ Distributor: d.name, SalesLakh: d.sales, Orders: d.orders, OnTimePct: d.onTime, ReturnsPct: d.returns }));
    } else if (activeTab === "inventory") {
      rows = invKpis.map(k => ({ SKU: k.sku, Turnover: k.turnover, DaysCover: k.daysCover }));
    } else if (activeTab === "fulfillment") {
      rows = fulfillMetrics.map(m => ({ Day: m.day, ProcessingHrs: m.processingHrs, SLA: m.sla, BackorderPct: m.backorder, ReturnsPct: m.returns }));
    } else {
      rows = salesByMonth.map(m => ({ Month: m.month, Revenue: m.revenue, Orders: m.orders, B2B: m.b2b, B2C: m.b2c }));
    }

    const header = Object.keys(rows[0] || {});
    const csv = [header.join(",")].concat(rows.map(r => header.map(h => r[h]).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${activeTab}-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Derived B2B metrics (mock values)
  const aov = Math.round((summary.totalRevenue * 100000) / (summary.totalOrders || 1)); // pretend revenue in Lakh → INR
  const fillRate = 94; // % within SLA
  const creditUtilization = 68; // %
  const dso = 32; // days sales outstanding
  const rtoRate = 1.6; // %
  const damageRate = 0.7; // %

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Real-time visibility into sales, orders, inventory and fulfillment</CardDescription>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search distributor, SKU..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {salesByRegion.map(r => (
                  <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="b2b">B2B</SelectItem>
                <SelectItem value="b2c">B2C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="MTD">MTD</SelectItem>
                <SelectItem value="QTD">QTD</SelectItem>
                <SelectItem value="YTD">YTD</SelectItem>
                <SelectItem value="12M">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* B2B KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Revenue (Σ)</CardTitle><CardDescription>12M</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">₹{(summary.totalRevenue/1).toFixed(0)}L</div></CardContent></Card>
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Orders (Σ)</CardTitle><CardDescription>12M</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{summary.totalOrders}</div></CardContent></Card>
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">AOV</CardTitle><CardDescription>Avg Order Value</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">₹{aov.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Fill Rate</CardTitle><CardDescription>% within SLA</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{fillRate}%</div></CardContent></Card>
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Credit Utilization</CardTitle><CardDescription>of limit</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{creditUtilization}%</div></CardContent></Card>
        <Card><CardHeader className="pb-1"><CardTitle className="text-sm">DSO</CardTitle><CardDescription>Days</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{dso}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Total Revenue</CardTitle><CardDescription>vs last year</CardDescription></CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByMonth}><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} /></LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Orders</CardTitle><CardDescription>monthly trend</CardDescription></CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByMonth}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#6366f1" /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Channel Mix</CardTitle><CardDescription>B2B vs B2C</CardDescription></CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByMonth}>
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Area type="monotone" dataKey="b2b" stackId="1" stroke="#10b981" fill="#10b98133" />
                <Area type="monotone" dataKey="b2c" stackId="1" stroke="#ef4444" fill="#ef444433" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="overall">Overall Sales</TabsTrigger>
          <TabsTrigger value="distributors">Distributor Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="fulfillment">Order Fulfillment</TabsTrigger>
          <TabsTrigger value="forecast">Forecast vs Actual</TabsTrigger>
          <TabsTrigger value="exceptions">RTO & Damage</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Sales by Region</CardTitle><CardDescription>share of revenue</CardDescription></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={salesByRegion} dataKey="value" nameKey="name" innerRadius={55} outerRadius={100} label={({name, value}) => `${name} ${value}%`} labelLine>
                    {salesByRegion.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [v + '%', n]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributors" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Top Distributors</CardTitle><CardDescription>sales and order frequency</CardDescription></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributorPerf}>
                  <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#f59e0b" name="Sales (L)" />
                  <Bar dataKey="orders" fill="#6366f1" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Inventory KPIs</CardTitle><CardDescription>turnover and days of cover</CardDescription></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={invKpis}>
                  <XAxis dataKey="sku" /><YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="turnover" stroke="#10b981" name="Turnover" />
                  <Line type="monotone" dataKey="daysCover" stroke="#ef4444" name="Days of Cover" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fulfillment" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Operational Metrics</CardTitle><CardDescription>processing time, SLA, backorders, returns</CardDescription></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fulfillMetrics}>
                  <XAxis dataKey="day" /><YAxis /><Tooltip />
                  <Area type="monotone" dataKey="processingHrs" stroke="#6366f1" fill="#6366f133" name="Processing (hrs)" />
                  <Area type="monotone" dataKey="sla" stroke="#10b981" fill="#10b98133" name="% within SLA" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Forecast vs Actual</CardTitle><CardDescription>placeholder for future forecasting module</CardDescription></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This section will show forecasted demand vs actual sales with accuracy metrics once forecasting is enabled.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">RTO Rate</CardTitle><CardDescription>Returns to Origin</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{rtoRate}%</div></CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Damage Rate</CardTitle><CardDescription>in transit/warehouse</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{damageRate}%</div></CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Backorder Rate</CardTitle><CardDescription>last 30 days</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{(fulfillMetrics.reduce((a,b)=>a+b.backorder,0)/fulfillMetrics.length).toFixed(1)}%</div></CardContent></Card>
            <Card><CardHeader className="pb-1"><CardTitle className="text-sm">Return Rate</CardTitle><CardDescription>B2B</CardDescription></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{(fulfillMetrics.reduce((a,b)=>a+b.returns,0)/fulfillMetrics.length).toFixed(1)}%</div></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Exceptions Trend</CardTitle><CardDescription>weekly overview</CardDescription></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fulfillMetrics}>
                  <XAxis dataKey="day" /><YAxis /><Tooltip />
                  <Line type="monotone" dataKey="backorder" stroke="#f59e0b" name="Backorder %" />
                  <Line type="monotone" dataKey="returns" stroke="#ef4444" name="Returns %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalytics;


