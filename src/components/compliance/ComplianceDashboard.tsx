import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, Clock, Download, FileText, Filter, RefreshCw, Search, Shield, ShieldAlert } from "lucide-react";

type DocType = "GST" | "PAN" | "Agreement" | "Insurance" | "KYC";
type Status = "valid" | "expiring" | "expired" | "pending";

interface ComplianceItem {
  id: string;
  distributor: string;
  region: string;
  docType: DocType;
  docNumber: string;
  status: Status;
  expiry: string; // ISO
  lastAudit: string; // ISO
}

const items: ComplianceItem[] = [
  { id: 'CMP-001', distributor: 'Sharma Distributors', region: 'Delhi NCR', docType: 'GST', docNumber: '07ABCDE1234A1Z5', status: 'valid', expiry: '2026-01-31', lastAudit: '2025-05-01' },
  { id: 'CMP-002', distributor: 'Mumbai Electronics', region: 'Mumbai', docType: 'Agreement', docNumber: 'AGR-2023-ME-01', status: 'expiring', expiry: '2025-10-15', lastAudit: '2025-04-20' },
  { id: 'CMP-003', distributor: 'SouthTech Wholesale', region: 'Bangalore', docType: 'PAN', docNumber: 'ABCDE1234A', status: 'valid', expiry: '2030-12-31', lastAudit: '2025-03-18' },
  { id: 'CMP-004', distributor: 'Metro Teleshop', region: 'Chennai', docType: 'Insurance', docNumber: 'INS-CHEN-7782', status: 'expired', expiry: '2025-02-28', lastAudit: '2025-02-10' },
  { id: 'CMP-005', distributor: 'EastWave Traders', region: 'Kolkata', docType: 'KYC', docNumber: 'KYC-2024-09', status: 'pending', expiry: '2025-12-31', lastAudit: '2025-05-12' },
];

const statusColor: Record<Status, "default" | "secondary" | "destructive" | "outline"> = {
  valid: 'default',
  expiring: 'secondary',
  expired: 'destructive',
  pending: 'outline',
};

const ComplianceDashboard = () => {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [docType, setDocType] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return items.filter(i => {
      const q = query.toLowerCase();
      const matchesQ = !q || [i.distributor, i.id, i.docNumber].some(f => f.toLowerCase().includes(q));
      const matchesRegion = region === 'all' || i.region === region;
      const matchesDoc = docType === 'all' || i.docType === docType;
      const matchesStatus = status === 'all' || i.status === status;
      return matchesQ && matchesRegion && matchesDoc && matchesStatus;
    });
  }, [query, region, docType, status]);

  const upcomingExpiries = filtered.filter(f => f.status === 'expiring' || f.status === 'expired').length;

  const exportCsv = () => {
    const rows = filtered.map(r => ({
      ID: r.id,
      Distributor: r.distributor,
      Region: r.region,
      DocType: r.docType,
      DocNumber: r.docNumber,
      Status: r.status,
      Expiry: r.expiry,
      LastAudit: r.lastAudit,
    }));
    const header = Object.keys(rows[0] || {});
    const csv = [header.join(',')].concat(rows.map(r => header.map(h => r[h as keyof typeof r]).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'compliance-export.csv'; a.click(); URL.revokeObjectURL(url);
  };

  // Role-based access control (RBAC) mock data
  const roles = [
    { key: 'distributor', name: 'Distributor', perms: ['Place Orders', 'View Own Orders'] },
    { key: 'distributor_admin', name: 'Distributor Admin', perms: ['Manage Distributor Users', 'View All Distributor Orders'] },
    { key: 'sales_admin', name: 'Sales Admin', perms: ['Approve Orders', 'View All Orders', 'Manage Users'] },
    { key: 'inventory_manager', name: 'Inventory Manager', perms: ['Receive Stock', 'Dispatch Orders', 'Transfer Stock'] },
    { key: 'finance', name: 'Finance', perms: ['View Invoices', 'Record Payments', 'Manage Credit'] },
    { key: 'executive', name: 'Executive', perms: ['View Analytics Dashboards'] },
    { key: 'system_admin', name: 'System Admin', perms: ['All Permissions', 'User Provisioning', 'MFA Policy'] },
  ];

  const users = [
    { id: 'USR-001', name: 'Amit Sharma', email: 'amit@company.com', role: 'sales_admin', mfa: true, lastActive: '2025-09-20' },
    { id: 'USR-002', name: 'Neha Gupta', email: 'neha@company.com', role: 'inventory_manager', mfa: false, lastActive: '2025-09-22' },
    { id: 'USR-003', name: 'Rahul Verma', email: 'rahul@company.com', role: 'finance', mfa: true, lastActive: '2025-09-24' },
  ];

  // Credit management mock data
  const creditRows = [
    { distributor: 'Sharma Distributors', region: 'Delhi NCR', limit: 15000000, outstanding: 8200000, overdue: 1200000, nextDue: '2025-10-05' },
    { distributor: 'Mumbai Electronics', region: 'Mumbai', limit: 30000000, outstanding: 21500000, overdue: 0, nextDue: '2025-10-10' },
    { distributor: 'SouthTech Wholesale', region: 'Bangalore', limit: 10000000, outstanding: 2600000, overdue: 0, nextDue: '2025-10-12' },
    { distributor: 'Metro Teleshop', region: 'Chennai', limit: 4000000, outstanding: 3600000, overdue: 600000, nextDue: '2025-09-28' },
  ];

  const currency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>Documents, audits, expiries and policy adherence</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Export</Button>
              <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search distributor, doc no., ID" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Array.from(new Set(items.map(i => i.region))).map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger>
                <SelectValue placeholder="Document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Docs</SelectItem>
                {(["GST","PAN","Agreement","Insurance","KYC"] as DocType[]).map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
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
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {upcomingExpiries > 0 && (
        <Alert className="border-amber-400 bg-amber-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Action required:</span> {upcomingExpiries} document(s) expiring or expired. Review and request renewals.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">Valid Docs</CardTitle><CardDescription>in good standing</CardDescription></CardHeader>
          <CardContent className="pt-0"><div className="text-2xl font-bold flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600" />{filtered.filter(f => f.status === 'valid').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">Expiring Soon</CardTitle><CardDescription>renew within 60 days</CardDescription></CardHeader>
          <CardContent className="pt-0"><div className="text-2xl font-bold flex items-center gap-2"><Clock className="h-5 w-5 text-amber-600" />{filtered.filter(f => f.status === 'expiring').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">Expired</CardTitle><CardDescription>needs immediate attention</CardDescription></CardHeader>
          <CardContent className="pt-0"><div className="text-2xl font-bold flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-red-600" />{filtered.filter(f => f.status === 'expired').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm">Pending KYC</CardTitle><CardDescription>awaiting verification</CardDescription></CardHeader>
          <CardContent className="pt-0"><div className="text-2xl font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-blue-600" />{filtered.filter(f => f.status === 'pending').length}</div></CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Compliance Records ({filtered.length})</CardTitle><CardDescription>per distributor</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Doc</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Last Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.distributor}</TableCell>
                  <TableCell>{r.region}</TableCell>
                  <TableCell>{r.docType}</TableCell>
                  <TableCell>{r.docNumber}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor[r.status]}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(r.expiry).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(r.lastAudit).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Policy notes */}
      <Card>
        <CardHeader><CardTitle>Policies & Requirements</CardTitle><CardDescription>quick checklist for B2B compliance</CardDescription></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Maintain valid GST and PAN records for all distributors; agreements renewed annually.</p>
          <p>• Liability insurance proof must be current; expiries trigger order holds.</p>
          <p>• KYC verification required before enabling credit terms and dispatches.</p>
          <p>• Quarterly audits logged with outcomes; non-compliance may apply penalties per contract.</p>
        </CardContent>
      </Card>

      {/* RBAC Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Roles & Permissions</CardTitle><CardDescription>predefined roles</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { key: 'distributor', name: 'Distributor', perms: ['Place Orders', 'View Own Orders'] },
                  { key: 'distributor_admin', name: 'Distributor Admin', perms: ['Manage Distributor Users', 'View All Distributor Orders'] },
                  { key: 'sales_admin', name: 'Sales Admin', perms: ['Approve Orders', 'View All Orders', 'Manage Users'] },
                  { key: 'inventory_manager', name: 'Inventory Manager', perms: ['Receive Stock', 'Dispatch Orders', 'Transfer Stock'] },
                  { key: 'finance', name: 'Finance', perms: ['View Invoices', 'Record Payments', 'Manage Credit'] },
                  { key: 'executive', name: 'Executive', perms: ['View Analytics Dashboards'] },
                  { key: 'system_admin', name: 'System Admin', perms: ['All Permissions', 'User Provisioning', 'MFA Policy'] },
                ].map(r => (
                  <TableRow key={r.key}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.perms.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle>Internal Users</CardTitle><CardDescription>MFA & last active</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'USR-001', name: 'Amit Sharma', email: 'amit@company.com', role: 'Sales Admin', mfa: true, lastActive: '2025-09-20' },
                  { id: 'USR-002', name: 'Neha Gupta', email: 'neha@company.com', role: 'Inventory Manager', mfa: false, lastActive: '2025-09-22' },
                  { id: 'USR-003', name: 'Rahul Verma', email: 'rahul@company.com', role: 'Finance', mfa: true, lastActive: '2025-09-24' },
                ].map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.mfa ? 'Enabled' : 'Disabled'}</TableCell>
                    <TableCell>{new Date(u.lastActive).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Credit Management Overview */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Credit Management</CardTitle><CardDescription>limits, outstanding, overdue</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distributor</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Limit</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead className="text-right">Overdue</TableHead>
                <TableHead>Next Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { distributor: 'Sharma Distributors', region: 'Delhi NCR', limit: 15000000, outstanding: 8200000, overdue: 1200000, nextDue: '2025-10-05' },
                { distributor: 'Mumbai Electronics', region: 'Mumbai', limit: 30000000, outstanding: 21500000, overdue: 0, nextDue: '2025-10-10' },
                { distributor: 'SouthTech Wholesale', region: 'Bangalore', limit: 10000000, outstanding: 2600000, overdue: 0, nextDue: '2025-10-12' },
                { distributor: 'Metro Teleshop', region: 'Chennai', limit: 4000000, outstanding: 3600000, overdue: 600000, nextDue: '2025-09-28' },
              ].map(c => {
                const util = Math.round((c.outstanding / c.limit) * 100);
                const currency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
                return (
                  <TableRow key={c.distributor}>
                    <TableCell>{c.distributor}</TableCell>
                    <TableCell>{c.region}</TableCell>
                    <TableCell className="text-right">{currency(c.limit)}</TableCell>
                    <TableCell className="text-right">{currency(c.outstanding)}</TableCell>
                    <TableCell className="text-right">{util}%</TableCell>
                    <TableCell className="text-right" style={{ color: c.overdue > 0 ? 'var(--red-500)' as any : undefined }}>{currency(c.overdue)}</TableCell>
                    <TableCell>{new Date(c.nextDue).toLocaleDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDashboard;


