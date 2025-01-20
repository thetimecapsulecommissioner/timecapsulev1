import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="max-w-6xl mx-auto pt-32 px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12 text-center">About The Time Capsule</h1>
        
        {/* First Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">What's the Time Capsule?</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              It's a community competition, where competitors have their predictive skills and knowledge tested against their friends, by answering a series of intriguing questions. You and your mates then gather to count back the points and see who won, while winning prizes and supporting a great cause!
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Second Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">How does the game work?</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              Each competitors enters their responses to a set of questions, which if answered correctly will earn them points. These insights once completed, are securely stored in the "Time Capsule" for the duration of the relevant event, such as the AFL Season.
            </p>
          </div>
        </div>

        {/* Third Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">What happens at the end of the season?</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              Once the season comes to a close, the Time Capsule must be opened, and this is done at a Brownlow-Style awards night. Reason enough to enter, regardless of sports knowledge, your community gathers, points are counted down and the winners unveiled! A great opportunity to get together and celebrate the season with your community, the night includes fun and prizes for all!
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Fourth Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">History</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              The Time Capsule is now entering its fourth season. Our third season saw 60 people take part and our biggest event ever held at Inner North Brewing Company. That event saw Will Horsfall crowned as our winner, storming into a win during his debut season.
            </p>
          </div>
        </div>

        {/* Fifth Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">Mission</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              The Time Capsule wants to help in building genuine community and connection through exciting games and engaging events. It also seeks to be a part of fundraising and creating awareness about important causes to its community. In our latest season, we proudly raised $2,500 for Movember, supporting men's health initiatives. This year, The Time Capsule is excited to extend its mission to raising funds and awareness for community sporting organisations. Cost of living pressures are effecting our community organisations more than most and we are excited at the prospect of being a part of the solution. If you would like to register your community group as a Time Capsule Partner so they can be in the fundraising pool, please contact us through through the below linked page!
            </p>
          </div>
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
        </div>

        {/* Sixth Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2 h-64 bg-mystical-200/10 rounded-lg flex items-center justify-center">
            <span className="text-secondary/50">Image Placeholder</span>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl text-secondary/90 italic mb-4">The Time Capsule in 2025</h2>
            <p className="text-secondary/90 text-lg leading-relaxed">
              We are excited to this year be opening up the Time Capsule to entry by referral from a current member. This will ensure this tight-knit community remains while still be able to spread the Time Capsule impacts wider! If you want to be involved for the first time, please mention your reference's name when registering!
            </p>
          </div>
        </div>

        {/* Final Message */}
        <div className="text-center mb-12">
          <p className="text-secondary/90 text-xl leading-relaxed">
            Join us in celebrating the blend of competition, community, and charity through one of the below links, as we embark on another thrilling season of The Time Capsule!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Button 
            variant="secondary" 
            className="text-primary font-semibold"
            onClick={() => navigate('/register')}
          >
            Register your account
          </Button>
          <Button 
            variant="secondary" 
            className="text-primary font-semibold"
            onClick={() => navigate('/login')}
          >
            Log-in to your existing account
          </Button>
          <Button 
            variant="secondary" 
            className="text-primary font-semibold"
            onClick={() => navigate('/register-group')}
          >
            Register your community group
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;