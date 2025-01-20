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
          content="It's a community competition, where competitors have their predictive skills and knowledge tested against their friends, by answering a series of intriguing questions. You and your mates then gather to count back the points and see who won, while winning prizes and supporting a great cause!"
          imagePosition="right"
        />

        <AboutSection
          title="How does the game work?"
          content="Each competitors enters their responses to a set of questions, which if answered correctly will earn them points. These insights once completed, are securely stored in the 'Time Capsule' for the duration of the relevant event, such as the AFL Season."
          imagePosition="left"
        />

        <AboutSection
          title="What happens at the end of the season?"
          content="Once the season comes to a close, the Time Capsule must be opened, and this is done at a Brownlow-Style awards night. Reason enough to enter, regardless of predictive skills, your community gathers, points are counted down and the winners unveiled! A great opportunity to get together and celebrate the season with your community, the night includes fun and prizes for all!"
          imagePosition="right"
        />

        <AboutSection
          title="History"
          content="The Time Capsule is now entering its fourth season. Our third season saw 60 people take part and our biggest event ever held at Inner North Brewing Company. That event saw Will Horsfall crowned as our winner, storming into a win during his debut season. In our latest season, we proudly raised $2,500 for Movember, supporting men's health initiatives."
          imagePosition="left"
        />

        <AboutSection
          title="Mission"
          content="The Time Capsule wants to help in building genuine community and connection through exciting games and engaging events. It also seeks to be a part of fundraising and creating awareness about important causes to its community. This year, The Time Capsule is excited to extend its mission to supporting community sporting organisations. Local sporting clubs are the centre of many communities and cost of living pressures are affecting them more than most. If you would like to register your community group as a Time Capsule Partner, so they can be in the fundraising pool, please contact us through the below linked page!"
          imagePosition="right"
        />

        <AboutSection
          title="The Time Capsule in 2025"
          content="We are excited to this year be opening up the Time Capsule to entry by referral from a current member. This will ensure this tight-knit community remains while still be able to spread the Time Capsule impacts wider! If you want to be involved for the first time, please mention your reference's name when registering!"
          imagePosition="left"
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