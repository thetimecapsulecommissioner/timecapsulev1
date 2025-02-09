
import { Navigation } from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-12 text-center">
            Frequently Asked Questions
          </h1>

          <div className="bg-white/5 rounded-lg p-6">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-secondary hover:text-secondary/90">
                  Placeholder FAQ Question?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  Placeholder FAQ Answer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
