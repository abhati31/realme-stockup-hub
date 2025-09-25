import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Download, Filter, Search, Users } from "lucide-react";

interface Distributor {
  id: string;
  name: string;
  region: string;
  tier: "Premium Partner" | "Gold Partner" | "Silver Partner" | "Bronze Partner";
  activeSince: string; // ISO
  salesYTD: number; // INR
  purchasesYTD: number; // INR
  creditLimit: number; // INR
  creditUsed: number; // INR
  status: "active" | "on_hold" | "inactive";
}

const distributors: Distributor[] = [
  { id: "DST-001", name: "Sharma Distributors", region: "Delhi NCR", tier: "Gold Partner", activeSince: "2022-03-01", salesYTD: 41200000, purchasesYTD: 39900000, creditLimit: 15000000, creditUsed: 8200000, status: "active" },
  { id: "DST-002", name: "Mumbai Electronics", region: "Mumbai", tier: "Premium Partner", activeSince: "2020-07-15", salesYTD: 65800000, purchasesYTD: 63200000, creditLimit: 30000000, creditUsed: 21500000, status: "active" },
  { id: "DST-003", name: "SouthTech Wholesale", region: "Bangalore", tier: "Silver Partner", activeSince: "2023-01-20", salesYTD: 18400000, purchasesYTD: 17600000, creditLimit: 10000000, creditUsed: 2600000, status: "active" },
  { id: "DST-004", name: "Metro Teleshop", region: "Chennai", tier: "Bronze Partner", activeSince: "2024-02-11", salesYTD: 7200000, purchasesYTD: 6900000, creditLimit: 4000000, creditUsed: 3600000, status: "on_hold" },
  { id: "DST-005", name: "EastWave Traders", region: "Kolkata", tier: "Gold Partner", activeSince: "2021-05-09", salesYTD: 23300000, purchasesYTD: 22100000, creditLimit: 12000000, creditUsed: 5400000, status: "active" },
];

const currency = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const DistributorsList = () => {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return distributors.filter((d) => {
      const q = query.toLowerCase();
      const matchesQ = !q || [d.id, d.name, d.region].some((f) => f.toLowerCase().includes(q));
      const matchesRegion = region === "all" || d.region === region;
      const matchesTier = tier === "all" || d.tier === tier;
      const matchesStatus = status === "all" || d.status === status;
      return matchesQ && matchesRegion && matchesTier && matchesStatus;
    });
  }, [query, region, tier, status]);

  const totals = useMemo(() => {
    return filtered.reduce((acc, d) => {
      acc.sales += d.salesYTD; acc.purchases += d.purchasesYTD; return acc;
    }, { sales: 0, purchases: 0 });
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Distributors</h1>
            <p className="text-sm text-muted-foreground">Partner list with region, sales and credit overview</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Sales YTD: <span className="font-medium text-foreground">{currency(totals.sales)}</span> • Purchases YTD: <span className="font-medium text-foreground">{currency(totals.purchases)}</span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search by name, ID, and filter by region, tier, status</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID or region" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(distributors.map(d => d.region))).map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger>
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {Array.from(new Set(distributors.map(d => d.tier))).map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Partners ({filtered.length})</CardTitle>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Active Since</TableHead>
                <TableHead className="text-right">Sales YTD</TableHead>
                <TableHead className="text-right">Purchases YTD</TableHead>
                <TableHead className="text-right">Credit Used / Limit</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.region}</TableCell>
                  <TableCell>{d.tier}</TableCell>
                  <TableCell>{new Date(d.activeSince).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{currency(d.salesYTD)}</TableCell>
                  <TableCell className="text-right">{currency(d.purchasesYTD)}</TableCell>
                  <TableCell className="text-right">{currency(d.creditUsed)} / {currency(d.creditLimit)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={d.status === 'active' ? 'default' : d.status === 'on_hold' ? 'secondary' : 'outline'}>
                      {d.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm"><ArrowUpRight className="h-4 w-4 mr-1" />View</Button>
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

export default DistributorsList;


