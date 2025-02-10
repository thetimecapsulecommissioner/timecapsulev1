
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
            FAQs
          </h1>

          <div className="bg-white/5 rounded-lg p-6">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-secondary hover:text-secondary/90 text-left">
                  What sort of predictions am I making?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  The questions are relatively straightforward questions about a sporting event, likely the AFL. Examples include, who will win the Brownlow, where will the team you support finish on the ladder and who will be the most successful new coach? Almost all the responses are from a fixed list that is made available to you!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-secondary hover:text-secondary/90 text-left">
                  Are my predictions public?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  Your predictions are kept private for the duration of the season and correct predictions are then revealed at the end of season event!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-secondary hover:text-secondary/90 text-left">
                  How does the event work?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  The main Time Capsule Competition culminates in an end of season awards night, where the predictions competitors make are revealed and the winners are revealed! Tickets and details for this event will be released and communicated later in the year, however it will be held on Saturday the 15th of November in 2025
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-secondary hover:text-secondary/90 text-left">
                  What does my entry cost and where does it go?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  To enter the competition, an entrant must pay a $60 entry fee. $25 of this entry fee will be donated to the pool of registered community sporting organisations, The other $35 of the entry fee will be added to the winnings pool to be allocated to competition winners!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-secondary hover:text-secondary/90 text-left">
                  How often and many predictions do I have to make?
                </AccordionTrigger>
                <AccordionContent className="text-secondary/80">
                  This year, the main competition has 28 Pre-Season Prediction Questions and will have up to 4 rounds of in-season questions, of no more than three questions each! These in-season questions will be communicated to players through Instagram and the competition group chat.
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

