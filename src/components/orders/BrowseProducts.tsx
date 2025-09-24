import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, ShoppingCart, Plus, Minus } from "lucide-react";

interface BrowseProductsProps {
  onBack: () => void;
  onProceed: (items: Array<{ sku: string; quantity: number; name: string; price: number }>) => void;
}

const BrowseProducts = ({ onBack, onProceed }: BrowseProductsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', name: 'All Products', count: 24 },
    { id: 'smartphones', name: 'Smartphones', count: 16 },
    { id: 'accessories', name: 'Accessories', count: 8 },
  ];

  const products = [
    { sku: 'RMX-3561', name: 'Realme GT 6 - 8GB/256GB', price: 23999, category: 'smartphones', stock: 45, image: '📱' },
    { sku: 'RMX-3562', name: 'Realme GT 6 - 12GB/256GB', price: 26999, category: 'smartphones', stock: 32, image: '📱' },
    { sku: 'RMX-3760', name: 'Realme 12 Pro+ - 8GB/256GB', price: 29999, category: 'smartphones', stock: 28, image: '📱' },
    { sku: 'RMX-3761', name: 'Realme 12 Pro - 8GB/256GB', price: 25999, category: 'smartphones', stock: 51, image: '📱' },
    { sku: 'ACC-001', name: 'Realme Buds T300', price: 2299, category: 'accessories', stock: 120, image: '🎧' },
    { sku: 'ACC-002', name: 'Realme Power Bank 10000mAh', price: 1499, category: 'accessories', stock: 75, image: '🔋' },
  ];

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const updateCart = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[sku];
      setCart(newCart);
    } else {
      setCart({ ...cart, [sku]: quantity });
    }
  };

  const cartItems = Object.entries(cart).map(([sku, quantity]) => {
    const product = products.find(p => p.sku === sku)!;
    return { sku, quantity, name: product.name, price: product.price };
  });

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Browse Products</h1>
          <p className="text-muted-foreground">
            Use filters on the left to narrow products by category, price, or availability
          </p>
        </div>
        {totalItems > 0 && (
          <Button onClick={() => onProceed(cartItems)} variant="hero" size="lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Review Cart ({totalItems})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cart Summary */}
          {totalItems > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-bold">₹{totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Grid */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.sku} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{product.image}</div>
                    <Badge variant={product.stock > 20 ? "default" : "destructive"}>
                      {product.stock} in stock
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>SKU: {product.sku}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </div>
                    
                    {cart[product.sku] ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCart(product.sku, cart[product.sku] - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {cart[product.sku]}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCart(product.sku, cart[product.sku] + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => updateCart(product.sku, 1)}
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;