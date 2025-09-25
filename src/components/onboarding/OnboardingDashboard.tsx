import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  UserPlus,
  Filter,
  Search,
  Eye,
  Edit,
  MessageSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OnboardingApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  territory: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info';
  submittedDate: string;
  documents: number;
  progress: number;
}

interface OnboardingDashboardProps {
  onViewApplication: (id: string) => void;
  onCreateAccount: (id: string) => void;
  onStartNewApplication?: () => void;
}

const mockApplications: OnboardingApplication[] = [
  {
    id: "APP-001",
    companyName: "Tech Solutions Pvt Ltd",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@techsolutions.com",
    phone: "+91 9876543210",
    territory: "Delhi NCR",
    status: "pending",
    submittedDate: "2024-01-15",
    documents: 4,
    progress: 75
  },
  {
    id: "APP-002", 
    companyName: "Mumbai Electronics",
    contactPerson: "Priya Sharma",
    email: "priya@mumbaielectronics.com",
    phone: "+91 8765432109",
    territory: "Mumbai",
    status: "under_review",
    submittedDate: "2024-01-12",
    documents: 5,
    progress: 100
  },
  {
    id: "APP-003",
    companyName: "South India Distributors",
    contactPerson: "Suresh Menon",
    email: "suresh@southindia.com", 
    phone: "+91 7654321098",
    territory: "Chennai",
    status: "needs_info",
    submittedDate: "2024-01-10",
    documents: 3,
    progress: 60
  }
];

const OnboardingDashboard = ({ onViewApplication, onCreateAccount, onStartNewApplication }: OnboardingDashboardProps) => {
  const [applications, setApplications] = useState<OnboardingApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      under_review: "default", 
      approved: "default",
      rejected: "destructive",
      needs_info: "outline"
    };
    
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      under_review: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      approved: "bg-green-100 text-green-800 hover:bg-green-100", 
      rejected: "bg-red-100 text-red-800 hover:bg-red-100",
      needs_info: "bg-orange-100 text-orange-800 hover:bg-orange-100"
    };

    return (
      <Badge variant="secondary" className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.territory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    underReview: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    needsInfo: applications.filter(app => app.status === 'needs_info').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Manage distributor applications and onboarding process
          </p>
        </div>
        <Button onClick={() => onStartNewApplication?.()} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.underReview}</p>
                <p className="text-sm text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.needsInfo}</p>
                <p className="text-sm text-muted-foreground">Needs Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="needs_info">Needs Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{application.companyName}</h3>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><strong>Contact:</strong> {application.contactPerson}</p>
                      <p><strong>Email:</strong> {application.email}</p>
                    </div>
                    <div>
                      <p><strong>Phone:</strong> {application.phone}</p>
                      <p><strong>Territory:</strong> {application.territory}</p>
                    </div>
                    <div>
                      <p><strong>Applied:</strong> {new Date(application.submittedDate).toLocaleDateString()}</p>
                      <p><strong>Documents:</strong> {application.documents} uploaded</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Progress:</span>
                    <Progress value={application.progress} className="flex-1 max-w-48" />
                    <span className="text-sm font-medium">{application.progress}%</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewApplication(application.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  
                  {application.status === 'needs_info' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </Button>
                  )}
                  
                  {(application.status === 'under_review' || application.status === 'pending') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Review
                    </Button>
                  )}
                  
                  {application.status === 'approved' && (
                    <Button 
                      size="sm"
                      onClick={() => onCreateAccount(application.id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No vendor applications have been submitted yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OnboardingDashboard;