import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { MODULES, RbacConfig, loadRbac, saveRbac } from "@/lib/rbac";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
  { id: 'USR-001', name: 'Amit Sharma', email: 'amit@company.com', role: 'Sales Admin', mfa: true, lastActive: '2025-09-20' },
  { id: 'USR-002', name: 'Neha Gupta', email: 'neha@company.com', role: 'Inventory Manager', mfa: false, lastActive: '2025-09-22' },
  { id: 'USR-003', name: 'Rahul Verma', email: 'rahul@company.com', role: 'Finance', mfa: true, lastActive: '2025-09-24' },
  { id: 'USR-004', name: 'Pooja Saini', email: 'pooja@company.com', role: 'Executive', mfa: true, lastActive: '2025-09-22' },
  { id: 'USR-005', name: 'Anuj Mehta', email: 'anuj@company.com', role: 'System Admin', mfa: true, lastActive: '2025-09-25' },
  { id: 'DUSR-001', name: 'Sanjay Rao', email: 'sanjay@sharma.co', role: 'Distributor Admin', mfa: true, lastActive: '2025-09-18' },
  { id: 'DUSR-002', name: 'Priyanka Iyer', email: 'priyanka@mumbai-elec.in', role: 'Distributor Staff', mfa: false, lastActive: '2025-09-21' },
];

const AccessControl = () => {
  const [cfg, setCfg] = useState<RbacConfig>(loadRbac());
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleKey, setNewRoleKey] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>(cfg.roles[0]?.key || "");
  const { toast } = useToast();

  const toggle = (roleIndex: number, moduleKey: string, field: 'view' | 'edit' | 'approve') => {
    setCfg(prev => {
      const next = structuredClone(prev);
      const role = next.roles[roleIndex];
      role.permissions[moduleKey as any][field] = !role.permissions[moduleKey as any][field];
      return next;
    });
  };

  const addRole = () => {
    if (!newRoleKey || !newRoleName) return;
    const exists = cfg.roles.some(r => r.key === newRoleKey);
    if (exists) return;
    const emptyPerms = MODULES.reduce((acc, m) => {
      acc[m.key] = { view: false, edit: false, approve: false } as any;
      return acc;
    }, {} as any);
    setCfg(prev => ({ ...prev, roles: [...prev.roles, { key: newRoleKey, name: newRoleName, permissions: emptyPerms }] }));
    setNewRoleKey(""); setNewRoleName("");
  };

  const removeRole = (key: string) => {
    setCfg(prev => {
      const roles = prev.roles.filter(r => r.key !== key);
      const next = { ...prev, roles };
      if (selectedRole === key) setSelectedRole(roles[0]?.key || "");
      return next;
    });
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'rbac-config.json'; a.click(); URL.revokeObjectURL(url);
  };

  const importJson: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setCfg(JSON.parse(String(reader.result)) as RbacConfig); } catch {}
    };
    reader.readAsText(file);
  };

  const persist = () => {
    saveRbac(cfg);
    toast({ description: "Access configuration saved." });
  };

  const roleIndex = useMemo(() => cfg.roles.findIndex(r => r.key === selectedRole), [cfg.roles, selectedRole]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management & Access Control</CardTitle>
              <CardDescription>Configure roles and permissions. Save or export the JSON config for file-based management.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={persist}>Save</Button>
              <Button variant="outline" size="sm" onClick={downloadJson}><Download className="h-4 w-4 mr-2" />Export</Button>
              <label className="inline-flex items-center gap-2 text-sm px-3 py-2 border rounded-md cursor-pointer bg-card">
                <Upload className="h-4 w-4" /> Import<input type="file" accept="application/json" className="hidden" onChange={importJson} />
              </label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Roles</CardTitle>
            <CardDescription>Create, select a role, then edit its permissions below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Role key (e.g., sales_ops)" value={newRoleKey} onChange={(e) => setNewRoleKey(e.target.value)} />
                <Input placeholder="Role name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
              </div>
              <Button size="sm" onClick={addRole}>Add Role</Button>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Select role to edit</div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger><SelectValue placeholder="Choose role" /></SelectTrigger>
                  <SelectContent>
                    {cfg.roles.map(r => (<SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm" onClick={() => selectedRole && removeRole(selectedRole)}>Remove Selected</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>Toggle permissions for the selected role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Module</TableHead>
                    <TableHead className="text-center w-24">View</TableHead>
                    <TableHead className="text-center w-24">Edit</TableHead>
                    <TableHead className="text-center w-28">Approve</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULES.map(m => (
                    <TableRow key={m.key}>
                      <TableCell className="font-medium">{m.label}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={roleIndex >= 0 && cfg.roles[roleIndex].permissions[m.key].view} onCheckedChange={() => roleIndex >= 0 && toggle(roleIndex, m.key, 'view')} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={roleIndex >= 0 && cfg.roles[roleIndex].permissions[m.key].edit} onCheckedChange={() => roleIndex >= 0 && toggle(roleIndex, m.key, 'edit')} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox checked={roleIndex >= 0 && cfg.roles[roleIndex].permissions[m.key].approve} onCheckedChange={() => roleIndex >= 0 && toggle(roleIndex, m.key, 'approve')} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2"><CardTitle>Internal & Distributor Users</CardTitle><CardDescription>MFA & last active</CardDescription></CardHeader>
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
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>
                      <Badge variant={u.mfa ? 'default' : 'secondary'}>{u.mfa ? 'MFA Enabled' : 'MFA Off'}</Badge>
                    </TableCell>
                    <TableCell>{new Date(u.lastActive).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle>Policies</CardTitle><CardDescription>profile changes, distributor user management</CardDescription></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Enforce strong passwords, MFA for privileged roles, and periodic password rotation.</p>
          <p>• Distributor Admins can create distributor staff users; staff are restricted to their company data.</p>
          <p>• Profile updates for sensitive fields (registered address, tax IDs) require internal approval.</p>
          <p>• Access checks throughout the app: e.g., only approvers see and can use the Approve action.</p>
          <p>• Maintain audit trails for user creation, role changes, deactivations and key actions.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;


