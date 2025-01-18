import { Navigation } from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="max-w-6xl mx-auto pt-32 px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12 text-center">About The Time Capsule</h1>
        
        {/* First Section - Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              Welcome to The Time Capsule, the premier sports prediction competition, where competitors have their predictive skills and knowledge tested by answering a series of intriguing questions.
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Second Section - Image Left, Text Right */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              Each correct response earns points, and these insights are securely stored in the "Time Capsule" for the duration of the relevant event, such as the AFL Season.
            </p>
          </div>
        </div>

        {/* Third Section - Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              Once the season draws to a close, the highlight of the Time Capsule arrives in that of the thrilling awards night, reminiscent of the prestigious Brownlow event. Reason enough to enter, regardless of sports knowledge, the questions are counted down and the winners unveiled based on their accumulated points.
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Fourth Section - Image Left, Text Right */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              The Time Capsule is now entering its fourth season. Our third season saw 60 people take part and our biggest event ever held at Inner North Brewing Company. That event saw Will Horsfall crowned as our winner, storming into a win during his debut season.
            </p>
          </div>
        </div>

        {/* Fifth Section - Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              The Time Capsule is a social enterprise, aiming to foster community and connection in its games and events. In addition to this, we look to raise funds for important causes. In our latest season, we proudly raised $2,500 for Movember, supporting men's health initiatives, with all proceeds going to this important cause.
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Sixth Section - Image Left, Text Right */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              This year, The Time Capsule is excited to extend its mission by this year raising funds for community sporting organisations. Cost of living pressures are effecting our community organisations more than most and we are excited at the prospect of being a part of the solution.
            </p>
          </div>
        </div>

        {/* Seventh Section - Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              Join us in celebrating the blend of competition, camaraderie, and charity as we embark on another thrilling season of The Time Capsule!
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;