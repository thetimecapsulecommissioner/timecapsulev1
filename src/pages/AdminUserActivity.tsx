
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminNav } from "@/components/admin/AdminNav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserActivityTable } from "@/components/admin/UserActivityTable";
import { UserActivityHeader } from "@/components/admin/UserActivityHeader";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useUserActivity } from "@/hooks/useUserActivity";

const AdminUserActivity = () => {
  const { isAdmin, isLoading } = useAdminCheck();
  const { activities, loadingActivities, fetchUserActivity } = useUserActivity();
  const location = useLocation();

  useEffect(() => {
    if (isAdmin) {
      fetchUserActivity();
    }
  }, [isAdmin]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminNav />
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <UserActivityHeader 
              activities={activities}
              loadingActivities={loadingActivities}
              onRefresh={fetchUserActivity}
            />
          </CardHeader>
          <CardContent>
            <UserActivityTable 
              activities={activities}
              loadingActivities={loadingActivities}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserActivity;
