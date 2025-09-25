import { ClipboardList, Package, Settings, TrendingUp, Users, Warehouse, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const adminMenuItems = [
  { icon: Warehouse, label: "Inventory", key: "inventory" },
  { icon: Package, label: "Orders", key: "orders" },
  { icon: UserPlus, label: "Onboarding", key: "onboarding" },
  { icon: Users, label: "Distributors", key: "distributors" },
  { icon: Users, label: "Access Control", key: "access" },
  { icon: ClipboardList, label: "Compliance", key: "compliance" },
  { icon: TrendingUp, label: "Analytics", key: "analytics" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const AdminSidebar = ({ currentView, onViewChange }: AdminSidebarProps) => {
  return (
    <aside className="w-60 border-r border-border bg-card min-h-[calc(100vh-4rem)] py-3">
      <nav className="px-2 space-y-1">
        {adminMenuItems.map((item) => (
          <Button
            key={item.key}
            variant={currentView === item.key ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onViewChange?.(item.key)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;


