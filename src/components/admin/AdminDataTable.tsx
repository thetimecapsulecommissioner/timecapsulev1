
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Download, RefreshCw } from "lucide-react";

type UserData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string;
  email: string | null;
  created_at: string;
};

type PredictionData = {
  id: string;
  user_id: string;
  display_name: string;
  question_id: number;
  answer: string;
  created_at: string;
  response_order: number;
};

export const AdminDataTable = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(true);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, display_name, email, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      // First fetch predictions
      const { data: predictionData, error: predictionError } = await supabase
        .from('predictions')
        .select('id, user_id, question_id, answer, created_at, response_order')
        .order('created_at', { ascending: false })
        .limit(100);

      if (predictionError) throw predictionError;
      
      if (!predictionData || predictionData.length === 0) {
        setPredictions([]);
        setIsLoadingPredictions(false);
        return;
      }
      
      // Get unique user IDs from predictions
      const userIds = [...new Set(predictionData.map(p => p.user_id))];
      
      // Fetch profile data for those users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds);
        
      if (profileError) throw profileError;
      
      // Create a mapping of user_id to display_name
      const userMap = new Map();
      profileData?.forEach(profile => {
        userMap.set(profile.id, profile.display_name);
      });
      
      // Combine the data
      const formattedData = predictionData.map(prediction => ({
        id: prediction.id,
        user_id: prediction.user_id,
        display_name: userMap.get(prediction.user_id) || 'Unknown',
        question_id: prediction.question_id,
        answer: prediction.answer,
        created_at: prediction.created_at,
        response_order: prediction.response_order,
      }));
      
      setPredictions(formattedData);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      toast.error('Failed to load predictions');
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPredictions();
  }, []);

  const exportUsersCSV = () => {
    if (!users.length) {
      toast.error('No data to export');
      return;
    }

    // Create CSV headers
    const headers = ['ID', 'First Name', 'Last Name', 'Display Name', 'Email', 'Created At'];
    
    // Create CSV rows
    const rows = users.map(user => [
      user.id,
      user.first_name || '',
      user.last_name || '',
      user.display_name,
      user.email || '',
      user.created_at
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Users exported successfully');
  };

  const exportPredictionsCSV = () => {
    if (!predictions.length) {
      toast.error('No data to export');
      return;
    }

    // Create CSV headers
    const headers = ['ID', 'User ID', 'Display Name', 'Question ID', 'Answer', 'Response Order', 'Created At'];
    
    // Create CSV rows
    const rows = predictions.map(pred => [
      pred.id,
      pred.user_id,
      pred.display_name,
      pred.question_id,
      pred.answer,
      pred.response_order,
      pred.created_at
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `predictions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Predictions exported successfully');
  };

  return (
    <Tabs defaultValue="users">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="predictions">Predictions</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>All registered users in the system</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUsers}
                disabled={isLoadingUsers}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportUsersCSV}
                disabled={isLoadingUsers || !users.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingUsers ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.display_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {[user.first_name, user.last_name].filter(Boolean).join(' ')}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="predictions">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Predictions</CardTitle>
              <CardDescription>Recent user predictions (limited to 100)</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchPredictions}
                disabled={isLoadingPredictions}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingPredictions ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportPredictionsCSV}
                disabled={isLoadingPredictions || !predictions.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Question ID</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Response #</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPredictions ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Loading predictions...
                      </TableCell>
                    </TableRow>
                  ) : predictions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No predictions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    predictions.map(pred => (
                      <TableRow key={pred.id}>
                        <TableCell>{pred.display_name}</TableCell>
                        <TableCell>{pred.question_id}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {pred.answer}
                        </TableCell>
                        <TableCell>{pred.response_order}</TableCell>
                        <TableCell>
                          {new Date(pred.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
