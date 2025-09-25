import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  FileText, 
  Building, 
  User, 
  MapPin, 
  CreditCard,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VendorRegistrationFormProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

const VendorRegistrationForm = ({ onBack, onSubmit }: VendorRegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    businessType: "",
    registeredAddress: "",
    gstNumber: "",
    panNumber: "",
    incorporationDate: "",
    
    // Contact Information
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    primaryContactDesignation: "",
    secondaryContactName: "",
    secondaryContactEmail: "",
    secondaryContactPhone: "",
    
    // Business Information
    territory: "",
    distributorTier: "",
    businessCategories: [],
    yearlyTurnover: "",
    
    // Bank Details
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    
    // Documents
    documents: {
      businessLicense: null,
      gstCertificate: null,
      panCard: null,
      bankStatement: null,
      distributorAgreement: null
    },
    
    // Agreement
    termsAccepted: false,
    dataProcessingConsent: false
  });

  const steps = [
    { number: 1, title: "Company Details", icon: Building },
    { number: 2, title: "Contact Information", icon: User },
    { number: 3, title: "Business Information", icon: MapPin },
    { number: 4, title: "Bank Details", icon: CreditCard },
    { number: 5, title: "Documents", icon: FileText },
    { number: 6, title: "Review & Submit", icon: CheckCircle }
  ];

  const territories = [
    "Delhi NCR", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Other"
  ];

  const distributorTiers = [
    "Premium Partner", "Gold Partner", "Silver Partner", "Bronze Partner"
  ];

  const businessCategories = [
    "Electronics", "Mobile Accessories", "Audio Products", "Smart Devices", 
    "Gaming Accessories", "Wearables", "Home Appliances"
  ];

  const getStepProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.businessType && formData.registeredAddress && formData.gstNumber;
      case 2:
        return formData.primaryContactName && formData.primaryContactEmail && formData.primaryContactPhone;
      case 3:
        return formData.territory && formData.distributorTier && formData.businessCategories.length > 0;
      case 4:
        return formData.bankName && formData.accountNumber && formData.ifscCode;
      case 5:
        return true; // Documents are optional for prototype
      case 6:
        return formData.termsAccepted && formData.dataProcessingConsent;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => updateFormData('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private_limited">Private Limited Company</SelectItem>
                    <SelectItem value="partnership">Partnership Firm</SelectItem>
                    <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registeredAddress">Registered Address *</Label>
              <Textarea
                id="registeredAddress"
                value={formData.registeredAddress}
                onChange={(e) => updateFormData('registeredAddress', e.target.value)}
                placeholder="Enter complete registered address"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number *</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => updateFormData('gstNumber', e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => updateFormData('panNumber', e.target.value)}
                  placeholder="AAAAA0000A"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Primary Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryContactName">Full Name *</Label>
                  <Input
                    id="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={(e) => updateFormData('primaryContactName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactDesignation">Designation</Label>
                  <Input
                    id="primaryContactDesignation"
                    value={formData.primaryContactDesignation}
                    onChange={(e) => updateFormData('primaryContactDesignation', e.target.value)}
                    placeholder="e.g., Director, Manager"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactEmail">Email Address *</Label>
                  <Input
                    id="primaryContactEmail"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => updateFormData('primaryContactEmail', e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryContactPhone">Phone Number *</Label>
                  <Input
                    id="primaryContactPhone"
                    value={formData.primaryContactPhone}
                    onChange={(e) => updateFormData('primaryContactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Secondary Contact (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryContactName">Full Name</Label>
                  <Input
                    id="secondaryContactName"
                    value={formData.secondaryContactName}
                    onChange={(e) => updateFormData('secondaryContactName', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryContactPhone">Phone Number</Label>
                  <Input
                    id="secondaryContactPhone"
                    value={formData.secondaryContactPhone}
                    onChange={(e) => updateFormData('secondaryContactPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="secondaryContactEmail">Email Address</Label>
                  <Input
                    id="secondaryContactEmail"
                    type="email"
                    value={formData.secondaryContactEmail}
                    onChange={(e) => updateFormData('secondaryContactEmail', e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="territory">Territory *</Label>
                <Select value={formData.territory} onValueChange={(value) => updateFormData('territory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    {territories.map(territory => (
                      <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributorTier">Distributor Tier *</Label>
                <Select value={formData.distributorTier} onValueChange={(value) => updateFormData('distributorTier', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {distributorTiers.map(tier => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Business Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {businessCategories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.businessCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData('businessCategories', [...formData.businessCategories, category]);
                        } else {
                          updateFormData('businessCategories', formData.businessCategories.filter(c => c !== category));
                        }
                      }}
                    />
                    <Label htmlFor={category} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearlyTurnover">Expected Yearly Turnover</Label>
              <Select value={formData.yearlyTurnover} onValueChange={(value) => updateFormData('yearlyTurnover', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select turnover range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_1cr">Under ₹1 Crore</SelectItem>
                  <SelectItem value="1_5cr">₹1-5 Crores</SelectItem>
                  <SelectItem value="5_10cr">₹5-10 Crores</SelectItem>
                  <SelectItem value="10_25cr">₹10-25 Crores</SelectItem>
                  <SelectItem value="above_25cr">Above ₹25 Crores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => updateFormData('bankName', e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select value={formData.accountType} onValueChange={(value) => updateFormData('accountType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => updateFormData('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code *</Label>
                <Input
                  id="ifscCode"
                  value={formData.ifscCode}
                  onChange={(e) => updateFormData('ifscCode', e.target.value)}
                  placeholder="e.g., SBIN0001234"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'businessLicense', label: 'Business License', required: true },
                { key: 'gstCertificate', label: 'GST Certificate', required: true },
                { key: 'panCard', label: 'PAN Card', required: true },
                { key: 'bankStatement', label: 'Bank Statement', required: false },
                { key: 'distributorAgreement', label: 'Signed Distributor Agreement', required: true }
              ].map(doc => (
                <Card key={doc.key} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {doc.label}
                      {doc.required && <span className="text-red-500">*</span>}
                    </Label>
                    {formData.documents[doc.key as keyof typeof formData.documents] && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop or click to upload
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">Application Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Company:</strong> {formData.companyName}</p>
                  <p><strong>Business Type:</strong> {formData.businessType}</p>
                  <p><strong>GST Number:</strong> {formData.gstNumber}</p>
                </div>
                <div>
                  <p><strong>Primary Contact:</strong> {formData.primaryContactName}</p>
                  <p><strong>Email:</strong> {formData.primaryContactEmail}</p>
                  <p><strong>Territory:</strong> {formData.territory}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Distributor Agreement</a>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.dataProcessingConsent}
                  onCheckedChange={(checked) => updateFormData('dataProcessingConsent', checked)}
                />
                <Label htmlFor="consent" className="text-sm">
                  I consent to processing of my personal data as per the <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Vendor Registration</h1>
          <p className="text-muted-foreground">Complete your application to become a Realme distributor</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
          
          <div className="flex flex-wrap justify-between gap-2">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-1
                  ${currentStep === step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : currentStep > step.number 
                      ? 'bg-green-600 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5" />;
            })()}
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription>
            Step {currentStep} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep()}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Application
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
          
          {!validateCurrentStep() && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Please fill in all required fields to continue</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRegistrationForm;