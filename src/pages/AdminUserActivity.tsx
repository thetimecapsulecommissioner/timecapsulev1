
import { useEffect } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminNav } from "@/components/admin/AdminNav";
import { useAdminCheck } from "@/components/admin/useAdminCheck";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { UserActivityTable } from "@/components/admin/UserActivityTable";
import { useUserActivity } from "@/hooks/useUserActivity";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminUserActivity = () => {
  const { isAdmin, isLoading: isAdminChecking } = useAdminCheck();
  const { activities, isLoading: isActivitiesLoading, fetchActivities } = useUserActivity();

  if (isAdminChecking) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Calculate stats
  const uniqueUsers = new Set(activities.filter(a => a.user_id).map(a => a.user_id)).size;
  const pageViews = activities.filter(a => a.event_type === 'page_view').length;
  const loginCount = activities.filter(a => a.event_type === 'login_success').length;

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminNav />
      
      <div className="mt-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>
              Track site visitors, login attempts, and user behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{uniqueUsers}</div>
                  <p className="text-sm text-muted-foreground">Unique Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{pageViews}</div>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{loginCount}</div>
                  <p className="text-sm text-muted-foreground">Login Events</p>
                </CardContent>
              </Card>
            </div>
            
            <UserActivityTable 
              activities={activities}
              isLoading={isActivitiesLoading}
              onRefresh={fetchActivities}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserActivity;
