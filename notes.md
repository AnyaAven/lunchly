1. update docstrings - customer class
2. update docstrings - reservation class


middleware fn
- check if the req.query contains "/?search="
    - if so, we are finding the customer by LIKE name in sql DONE
        - Requires creating another static method on customer class DONE
- else, the query will be all customers
- returning next() which will render a template (on the route)
    - render template
        - if there are any results, we are showing customers that match query in a list
        - else, show some error message - no matches


NOTE: check if middleware passes the req, res down to each

function onlyAllowElie(req, res, next) {

  req.customers = await Customer.all()
  if (req.query includes "search") {
    do a filter for LIKe (using the customer method)
    customer = ^^
  }

  next()
}
