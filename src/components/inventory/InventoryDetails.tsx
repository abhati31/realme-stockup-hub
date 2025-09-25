import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Filter, Search } from "lucide-react";

interface InventoryDetailsProps {
  onBack?: () => void;
}

interface InventoryRow {
  sku: string;
  model: string;
  category: string;
  location: string;
  stock: number;
  reserved: number;
}

const data: InventoryRow[] = [
  { sku: 'RMX-3561', model: 'Realme GT 6 - 8GB/256GB', category: 'Smartphones', location: 'Delhi DC', stock: 120, reserved: 15 },
  { sku: 'RMX-3562', model: 'Realme GT 6 - 12GB/256GB', category: 'Smartphones', location: 'Mumbai DC', stock: 80, reserved: 12 },
  { sku: 'RMX-3760', model: 'Realme 12 Pro+ - 8GB/256GB', category: 'Smartphones', location: 'Bangalore DC', stock: 65, reserved: 5 },
  { sku: 'RMX-3761', model: 'Realme 12 Pro - 8GB/256GB', category: 'Smartphones', location: 'Chennai DC', stock: 92, reserved: 7 },
  { sku: 'ACC-001', model: 'Realme Buds T300', category: 'Accessories', location: 'Delhi DC', stock: 540, reserved: 40 },
  { sku: 'ACC-002', model: 'Realme Power Bank 10000mAh', category: 'Accessories', location: 'Mumbai DC', stock: 320, reserved: 20 },
  { sku: 'ACC-003', model: 'Realme Watch S2', category: 'Wearables', location: 'Bangalore DC', stock: 150, reserved: 10 },
  { sku: 'RMX-2800', model: 'Realme C55 - 6GB/128GB', category: 'Smartphones', location: 'Kolkata DC', stock: 210, reserved: 30 },
];

const InventoryDetails = ({ onBack }: InventoryDetailsProps) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const q = query.toLowerCase();
      const matchesQ = !q || [r.sku, r.model].some((f) => f.toLowerCase().includes(q));
      const matchesCat = category === 'all' || r.category === category;
      const matchesLoc = location === 'all' || r.location === location;
      return matchesQ && matchesCat && matchesLoc;
    });
  }, [query, category, location]);

  const totals = useMemo(() => {
    return filtered.reduce((acc, r) => {
      acc.stock += r.stock; acc.reserved += r.reserved; return acc;
    }, { stock: 0, reserved: 0 });
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Inventory Details</h1>
            <p className="text-sm text-muted-foreground">Total SKUs active with model-wise stock</p>
          </div>
        </div>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and narrow down inventory</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by SKU or model" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(data.map(d => d.category))).map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {Array.from(new Set(data.map(d => d.location))).map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>SKUs ({filtered.length})</CardTitle>
            <CardDescription>Total Stock: {totals.stock} • Reserved: {totals.reserved} • Available: {totals.stock - totals.reserved}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">In Stock</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.sku}>
                  <TableCell>{r.sku}</TableCell>
                  <TableCell>{r.model}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell className="text-right">{r.stock}</TableCell>
                  <TableCell className="text-right">{r.reserved}</TableCell>
                  <TableCell className="text-right">{r.stock - r.reserved}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDetails;


