const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");

// Import GraphQL schema from the specified file
const typeDefs = importSchema("./schema.graphql");

// Load environment variables from a .env file
require("dotenv").config();

// Define resolver functions
const resolvers = {
  Query: {
    etherBalanceByAddress: (root, _args, { dataSources }) => 
      // Get ether balance for an address
      dataSources.ethDataSource.etherBalanceByAddress(),

    totalSupplyOfEther: (root, _args, { dataSources }) => 
      // Get total ether supply
      dataSources.ethDataSource.totalSupplyOfEther(),

    latestEthereumPrice: (root, _args, { dataSources }) => 
      // Get latest ETH price
      dataSources.ethDataSource.getLatestEthereumPrice(),

    blockConfirmationTime: (root, _args, { dataSources }) => 
      dataSources.ethDataSource.getBlockConfirmationTime(),       // Get avg block confirmation time

  },
};

const server = new ApolloServer({ // Create an Apollo Server instance with type definitions, resolvers, and data sources

  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

server.timeout = 0; // Set server timeout to 0 to disable it


server.listen("9000").then(({ url }) => { // Start the server and log the URL

  console.log(`🚀 Server ready at ${url}`); // Log the server URL
});
