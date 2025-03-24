
import { Navigation } from "@/components/Navigation";
import { AboutSection } from "@/components/about/AboutSection";
import { ActionButtons } from "@/components/about/ActionButtons";

const About = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="max-w-6xl mx-auto pt-32 px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12 text-center">About The Time Capsule</h1>
        
        <AboutSection
          title="What's the Time Capsule?"
          content="It's a sports prediction competition with mates and community at the centre of it. Competitors have their predictive skills and knowledge tested against their mates, by answering the important questions about sport. You and your mates then gather to go through the predictions and see who won, while winning prizes and supporting a great cause!"
          imagePosition="right"
          imageSrc="/lovable-uploads/2336bbd1-2408-436b-9a1b-50488d1da377.png"
        />

        <AboutSection
          title="How does the game work?"
          content="Each competitors enters their responses to a set of questions, which if answered correctly will earn them points. These insights once completed, are securely stored in the 'Time Capsule' for the duration of the relevant event, such as the AFL Season."
          imagePosition="left"
          imageSrc="/lovable-uploads/1c2ba28a-c0e1-45f2-adf4-90161ba44fcb.png"
        />

        <AboutSection
          title="What happens at the end of the season?"
          content="Once the season comes to a close, the Time Capsule must be opened, and this is done at a Brownlow-Style awards night. Reason enough to enter, regardless of predictive skills, your community gathers, points are counted down and the winners unveiled! A great opportunity to get together and celebrate the season with your community, the night includes fun and prizes for all!"
          imagePosition="right"
          imageSrc="/lovable-uploads/8320c47e-9843-452d-a7e9-43d11586f867.png"
        />

        <AboutSection
          title="History"
          content="The Time Capsule is now entering its fourth season. Our third season saw 60 people take part and our biggest event ever held at Inner North Brewing Company. That event saw Will Horsfall crowned as our winner, storming into a win during his debut season. In our latest season, we proudly raised $2,500 for Movember, supporting men's health initiatives."
          imagePosition="left"
          imageSrc="/lovable-uploads/649a08b2-8cc5-4584-b7e9-690895ac697c.png"
        />

        <AboutSection
          title="Mission"
          content="The Time Capsule wants to help in building genuine community and connection through exciting games and engaging events. It also seeks to be a part of fundraising and creating awareness about important causes to its community. This year, The Time Capsule is excited to extend its mission to supporting community sporting organisations. If you would like to register your community group as a Time Capsule Partner, please contact us through the below linked page!"
          imagePosition="right"
          imageSrc="/lovable-uploads/ef0e589f-e07b-48b5-b432-9eecbb113582.png"
        />

        <AboutSection
          title="The Time Capsule in 2025"
          content="We are excited to be offering the new &quot;Time Capsule Mini&quot; Competition for local sports teams, workplace or any interested groups. Free for the first five groups, please reach out if you are an interested group or sponsor business"
          imagePosition="left"
          imageSrc="/lovable-uploads/8ba92b6c-cf2f-4437-bbaf-a0c3265d6742.png"
        />

        <div className="text-center mb-12">
          <p className="text-secondary/90 text-xl leading-relaxed">
            Join us in celebrating the blend of competition, community, and charity through one of the below links, as we embark on another thrilling season of The Time Capsule!
          </p>
        </div>

        <ActionButtons />
      </div>
    </div>
  );
};

export default About;
