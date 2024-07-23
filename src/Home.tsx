import Layout from "./Layout";

const Home = () => {
  return (
    <Layout>
      <div className="md:col-start-1 md:col-span-2 lg:col-start-1 lg:col-span-4 space-y-2">
        <p>
          Hi there, I'm Zack. I'm working on bringing transparency to tech
          compensation practices over at{" "}
          <a
            href="https://complete.so"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Complete
          </a>
          . Stock-based compensation has been{" "}
          <a
            href="https://www.jstor.org/stable/3116557"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            popular among technology companies since the late 1950's
          </a>{" "}
          but is still poorly understood in the U.S. and even more poorly
          understood in other parts of the world.
        </p>
        <p>
          I've spent time developing single-board computers for home monitoring
          at Opendoor{" "}
          <a
            href="https://www.opendoor.com/articles/empowering-more-customers-to-move-with-safety-and-certainty"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            to allow home tours without agents
          </a>
          . I was also part of the team that helped{" "}
          <a
            href="https://www.sec.gov/ixviewer/ix.html?doc=/Archives/edgar/data/0001543151/000162828019007524/fy2019q1financialstate.htm"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            scale Uber Eats
          </a>{" "}
          from 0.1 orders per second to {">"}
          <span className="lining-nums">12</span> orders per second.
        </p>
        <p>
          When I'm not working, I'm usually reading, writing, or running. I'm
          currently reading{" "}
          <a
            href="https://en.wikipedia.org/wiki/Thinking_In_Systems:_A_Primer"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thinking in Systems
          </a>{" "}
          and learning more about machine learning from{" "}
          <a
            href="https://course.fast.ai/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            fast.ai
          </a>
          .
        </p>
      </div>
    </Layout>
  );
};

export default Home;
