import { ReactNode } from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 justify-between p-12 gap-4">
      <div className="md:col-span-4 lg:col-span-9">
        <h1 className="text-2xl font-bold">Zack Field</h1>
      </div>
      <nav className="md:col-span-2 lg:col-span-3 space-x-2">
        <Link to="/projects" className="text-sm underline">
          Projects
        </Link>
        <Link to="/writing" className="text-sm underline">
          Writing
        </Link>
        <a
          href="https://www.linkedin.com/in/zackeryfield/"
          className="text-sm underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://twitter.com/zack_field"
          className="text-sm underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a
          href="https://github.com/zacatac"
          className="text-sm underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
