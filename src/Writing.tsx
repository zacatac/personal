import Layout from "./Layout";

const Writing = () => {
  return (
    <Layout>
      <div className="md:col-start-1 md:col-span-2 lg:col-start-1 lg:col-span-4 space-y-2">
        <ul>
          <li>
            <a
              href="https://completelabs.substack.com/p/federating-a-graphql-api-between"
              className="text-sm underline"
            >
              Federating GraphQL
            </a>
          </li>
          <li>and not much else... yet</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Writing;
