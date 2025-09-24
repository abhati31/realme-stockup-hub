import { useState } from "react";
import { Menu, X, Package, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import realmeImage from "@/assets/realme-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Package, label: "Order Management", path: "/", active: true },
    { icon: BarChart3, label: "Analytics", path: "/analytics", active: false },
    { icon: Users, label: "Distributors", path: "/distributors", active: false },
    { icon: Settings, label: "Settings", path: "/settings", active: false },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src={realmeImage} alt="Realme" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-bold text-foreground">
              India Portal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;