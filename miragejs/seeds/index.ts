/*
 * Mirage JS guide on Seeds: https://miragejs.com/docs/data-layer/factories#in-development
 */
// @ts-ignore
const usersSeeder = (server) => {
  /*
   * This will create in the in memory DB 10 objects
   * of the Factory `user`. Moreover it creates a
   * random number of messages and assign to each
   * and every user, making use of relationships.
   */
  server.createList('user', 10);
};

// @ts-ignore
const productsSeeder = (server) => {
  server.createList('product', 25);
};

// @ts-ignore
export default function seeds(server) {
  usersSeeder(server);
  productsSeeder(server);
}
