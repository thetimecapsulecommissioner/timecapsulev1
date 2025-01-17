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
              Welcome to The Time Capsule, an exciting Prediction Competition where competitors have the opportunity to showcase their predictive skills by answering a series of intriguing questions. Each correct response earns points, and these insights are securely stored in the "Time Capsule" for the duration of the relevant event, such as the AFL Season. Once the season draws to a close, we host a thrilling awards night, reminiscent of the prestigious Brownlow event, where we unveil the winners based on their accumulated points.
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
              The Time Capsule is now entering its fourth season as a beloved competition. Our previous season witnessed the participation of 60 enthusiastic competitors, all eager to test their predictive skills. Not only has this event become a source of excitement among fans, but it also serves a noble purpose. In our latest season, we proudly raised $2,500 for Movember, supporting men's health initiatives, with all proceeds going to this important cause, separate from ticket sales.
            </p>
          </div>
        </div>

        {/* Third Section - Text Left, Image Right */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="md:w-1/2">
            <p className="text-secondary/90 text-lg leading-relaxed">
              This year, The Time Capsule is excited to extend its mission by raising funds for community sporting organizations, fostering local talent and supporting grassroots sports. Join us in celebrating the blend of competition, camaraderie, and charity as we embark on another thrilling season of The Time Capsule!
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