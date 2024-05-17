/**Middleware */
import Customer from "./models/customer.js";

/** Logger: prints log message and goes to next. */

function logger(req, res, next) {
  console.log(`Sending ${req.method} request to ${req.path}.`);
  return next();
}

/** Checks if the route query contains "/?search="
    * If so, passing a filtered list of customers by search term value.
    * Else, passing list of all customers.
 * List of customers will be stored within res.locals.customers */

async function checkSearchQuery(req, res, next) {
  if ("search" in req.query) {
    const searchValue = req.query.search;
    res.locals.customers = await Customer.getAllCustomersBySearch(searchValue);
  } else {
    res.locals.customers = await Customer.all();
  }
  next();
}


export { logger, checkSearchQuery };