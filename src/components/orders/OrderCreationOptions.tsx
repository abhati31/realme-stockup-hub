import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Upload, Grid3X3, Info } from "lucide-react";

interface OrderCreationOptionsProps {
  onBack: () => void;
  onSelectOption: (option: 'quick' | 'upload' | 'browse') => void;
}

const OrderCreationOptions = ({ onBack, onSelectOption }: OrderCreationOptionsProps) => {
  const options = [
    {
      id: 'quick' as const,
      title: "Quick Entry",
      description: "Know exactly what you need? Type or scan your SKUs here, and we'll fill your cart in seconds.",
      icon: Zap,
      bgClass: "bg-gradient-to-br from-primary/10 to-primary/5",
      iconColor: "text-primary"
    },
    {
      id: 'upload' as const,
      title: "Upload Your List",
      description: "Have a spreadsheet? Upload it—we'll handle the rest. Easy!",
      icon: Upload,
      bgClass: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600"
    },
    {
      id: 'browse' as const,
      title: "Browse Products",
      description: "Not sure yet? Browse our catalog with filters and favorites.",
      icon: Grid3X3,
      bgClass: "bg-gradient-to-br from-green-500/10 to-green-500/5",
      iconColor: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Order</h1>
          <p className="text-muted-foreground">Choose how you'd like to add products to your order</p>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <Card 
            key={option.id}
            className={`${option.bgClass} border border-border/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
            onClick={() => onSelectOption(option.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 rounded-full ${option.bgClass} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <option.icon className={`h-8 w-8 ${option.iconColor}`} />
              </div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-sm leading-relaxed">
                {option.description}
              </CardDescription>
              <Button 
                className="mt-4 w-full"
                variant="outline"
                size="sm"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Need Help Choosing?</h3>
              <p className="text-sm text-blue-700">
                <strong>Quick Entry</strong> is perfect when you know specific SKUs. 
                <strong> Upload</strong> works great for bulk orders from spreadsheets. 
                <strong> Browse</strong> is ideal for discovering new products or exploring categories.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCreationOptions;