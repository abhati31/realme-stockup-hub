import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Building, 
  User, 
  MapPin, 
  CreditCard,
  CheckCircle,
  XCircle,
  MessageSquare,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ApplicationData {
  id: string;
  companyName: string;
  businessType: string;
  registeredAddress: string;
  gstNumber: string;
  panNumber: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  territory: string;
  distributorTier: string;
  businessCategories: string[];
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  submittedDate: string;
  status: string;
  documents: {
    businessLicense: boolean;
    gstCertificate: boolean;
    panCard: boolean;
    bankStatement: boolean;
    distributorAgreement: boolean;
  };
}

interface ApplicationReviewProps {
  onBack: () => void;
  onApprove: (data: any) => void;
  onReject: (reason: string) => void;
  onRequestInfo: (message: string) => void;
}

const ApplicationReview = ({ onBack, onApprove, onReject, onRequestInfo }: ApplicationReviewProps) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [discountTier, setDiscountTier] = useState("");
  const [assignedManager, setAssignedManager] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [infoRequest, setInfoRequest] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);

  // Mock application data
  const applicationData: ApplicationData = {
    id: "APP-001",
    companyName: "Tech Solutions Pvt Ltd",
    businessType: "Private Limited Company",
    registeredAddress: "123 Business Park, Sector 18, Gurugram, Haryana - 122015",
    gstNumber: "07AAAAA0000A1Z5",
    panNumber: "AAAAA0000A",
    primaryContactName: "Rajesh Kumar",
    primaryContactEmail: "rajesh@techsolutions.com",
    primaryContactPhone: "+91 9876543210",
    territory: "Delhi NCR",
    distributorTier: "Gold Partner",
    businessCategories: ["Electronics", "Mobile Accessories", "Audio Products"],
    bankName: "State Bank of India",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    submittedDate: "2024-01-15",
    status: "under_review",
    documents: {
      businessLicense: true,
      gstCertificate: true,
      panCard: true,
      bankStatement: false,
      distributorAgreement: true
    }
  };

  const handleApprove = () => {
    const approvalData = {
      applicationId: applicationData.id,
      creditLimit,
      paymentTerms,
      discountTier,
      assignedManager,
      reviewNotes
    };
    onApprove(approvalData);
  };

  const handleReject = () => {
    onReject(rejectReason);
  };

  const handleRequestInfo = () => {
    onRequestInfo(infoRequest);
  };

  const getDocumentStatus = (hasDoc: boolean) => {
    return hasDoc ? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Uploaded</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Missing</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Application Review</h1>
            <p className="text-muted-foreground">Application ID: {applicationData.id}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {applicationData.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company Name</Label>
                  <p className="font-semibold">{applicationData.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
                  <p className="font-semibold">{applicationData.businessType}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Registered Address</Label>
                  <p className="font-semibold">{applicationData.registeredAddress}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">GST Number</Label>
                  <p className="font-semibold">{applicationData.gstNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">PAN Number</Label>
                  <p className="font-semibold">{applicationData.panNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Primary Contact</Label>
                  <p className="font-semibold">{applicationData.primaryContactName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="font-semibold">{applicationData.primaryContactEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="font-semibold">{applicationData.primaryContactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Territory</Label>
                  <p className="font-semibold">{applicationData.territory}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Distributor Tier</Label>
                  <p className="font-semibold">{applicationData.distributorTier}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Business Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {applicationData.businessCategories.map(category => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Bank Name</Label>
                  <p className="font-semibold">{applicationData.bankName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Number</Label>
                  <p className="font-semibold">{applicationData.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">IFSC Code</Label>
                  <p className="font-semibold">{applicationData.ifscCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: 'businessLicense', label: 'Business License', required: true },
                  { key: 'gstCertificate', label: 'GST Certificate', required: true },
                  { key: 'panCard', label: 'PAN Card', required: true },
                  { key: 'bankStatement', label: 'Bank Statement', required: false },
                  { key: 'distributorAgreement', label: 'Signed Distributor Agreement', required: true }
                ].map(doc => (
                  <div key={doc.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">{doc.label}</span>
                      {doc.required && <span className="text-red-500 text-sm">*</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {getDocumentStatus(applicationData.documents[doc.key as keyof typeof applicationData.documents])}
                      {applicationData.documents[doc.key as keyof typeof applicationData.documents] && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setShowApprovalForm(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Application
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowInfoForm(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request More Info
              </Button>
              
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowRejectForm(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </CardContent>
          </Card>

          {/* Application Status */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">{new Date(applicationData.submittedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">Under Review</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documents:</span>
                <span className="font-medium">4/5 Complete</span>
              </div>
            </CardContent>
          </Card>

          {/* Review Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your review notes here..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Form Modal */}
      {showApprovalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Approve Application</CardTitle>
              <CardDescription>Set up the distributor account parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                  <Input
                    id="creditLimit"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="5000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15_days">15 Days</SelectItem>
                      <SelectItem value="30_days">30 Days</SelectItem>
                      <SelectItem value="45_days">45 Days</SelectItem>
                      <SelectItem value="60_days">60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountTier">Discount Tier</Label>
                  <Select value={discountTier} onValueChange={setDiscountTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5_percent">5%</SelectItem>
                      <SelectItem value="7_percent">7%</SelectItem>
                      <SelectItem value="10_percent">10%</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedManager">Assigned Manager</Label>
                  <Select value={assignedManager} onValueChange={setAssignedManager}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager1">Amit Sharma</SelectItem>
                      <SelectItem value="manager2">Priya Singh</SelectItem>
                      <SelectItem value="manager3">Rohit Gupta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowApprovalForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!creditLimit || !paymentTerms || !discountTier || !assignedManager}
                >
                  Approve & Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Form Modal */}
      {showRejectForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Reject Application</CardTitle>
              <CardDescription>Please provide a reason for rejection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Explain why this application is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                >
                  Reject Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Request Info Form Modal */}
      {showInfoForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-orange-600">Request Additional Information</CardTitle>
              <CardDescription>Send a message to the applicant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe what additional information or documents are needed..."
                value={infoRequest}
                onChange={(e) => setInfoRequest(e.target.value)}
                rows={4}
              />
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowInfoForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRequestInfo}
                  disabled={!infoRequest.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Send Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;