import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { MODULES, RbacConfig, RoleConfig, loadRbac, saveRbac } from "@/lib/rbac";

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
];

const AccessControl = () => {
  const [cfg, setCfg] = useState<RbacConfig>(loadRbac());
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleKey, setNewRoleKey] = useState("");

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

  const removeRole = (key: string) => setCfg(prev => ({ ...prev, roles: prev.roles.filter(r => r.key !== key) }));

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

  const persist = () => saveRbac(cfg);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management & Access Control</CardTitle>
              <CardDescription>Roles, permissions, MFA policy, and audit considerations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={persist}>Save</Button>
              <Button variant="outline" size="sm" onClick={downloadJson}><Download className="h-4 w-4 mr-2" />Export</Button>
              <label className="inline-flex items-center gap-2 text-sm px-3 py-2 border rounded-md cursor-pointer">
                <Upload className="h-4 w-4" /> Import
                <input type="file" accept="application/json" className="hidden" onChange={importJson} />
              </label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle>Roles & Permissions</CardTitle><CardDescription>predefined roles</CardDescription></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cfg.roles.map((r, rIdx) => (
                  <TableRow key={r.key}>
                    <TableCell className="font-medium align-top w-48">
                      <div className="flex items-center justify-between gap-2">
                        <span>{r.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeRole(r.key)}>Remove</Button>
                      </div>
                      <div className="text-xs text-muted-foreground">{r.key}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {MODULES.map(m => (
                          <div key={m.key} className="border rounded-md p-2">
                            <div className="font-medium text-xs mb-1">{m.label}</div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-xs"><Checkbox checked={cfg.roles[rIdx].permissions[m.key].view} onCheckedChange={() => toggle(rIdx, m.key, 'view')} />View</label>
                              <label className="flex items-center gap-2 text-xs"><Checkbox checked={cfg.roles[rIdx].permissions[m.key].edit} onCheckedChange={() => toggle(rIdx, m.key, 'edit')} />Edit</label>
                              <label className="flex items-center gap-2 text-xs"><Checkbox checked={cfg.roles[rIdx].permissions[m.key].approve} onCheckedChange={() => toggle(rIdx, m.key, 'approve')} />Approve</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Input placeholder="Role key (e.g., sales_ops)" value={newRoleKey} onChange={(e) => setNewRoleKey(e.target.value)} />
              <Input placeholder="Role name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
              <Button size="sm" onClick={addRole}>Add Role</Button>
            </div>
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


