
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompetitionTemplateUpload } from "./CompetitionTemplateUpload";
import { QuestionsTemplateUpload } from "./QuestionsTemplateUpload";
import { TermTemplateManager } from "./TermTemplateManager";

const AdminTemplatesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pt-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
          Competition Templates
        </h1>
        <Button variant="outline" onClick={() => navigate("/admin")}>
          Back to Admin
        </Button>
      </div>

      <Tabs defaultValue="competitions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitions">Competition Templates</TabsTrigger>
          <TabsTrigger value="questions">Questions Templates</TabsTrigger>
          <TabsTrigger value="terms">Terms Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="competitions" className="space-y-4">
          <CompetitionTemplateUpload />
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <QuestionsTemplateUpload />
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <TermTemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTemplatesPage;
