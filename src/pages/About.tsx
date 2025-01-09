import { Navigation } from "@/components/Navigation";

const About = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-32 px-8">
        <h1 className="text-4xl font-bold text-secondary mb-8">About The Time Capsule</h1>
        <div className="prose prose-invert">
          <p className="text-secondary/90 text-lg">
            The Time Capsule is a unique platform where you can make predictions about the future
            and compete with your community to see who has the most accurate foresight.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
};

export default About;