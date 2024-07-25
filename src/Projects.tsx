import { Link } from "react-router-dom";
import Layout from "./Layout";

const Projects = () => {
  return (
    <Layout>
      <div className="md:col-start-1 md:col-span-2 lg:col-start-1 lg:col-span-4 space-y-2">
        <ul>
          <li>
            <Link to="/onebot" className="underline">
              onebot
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Projects;
