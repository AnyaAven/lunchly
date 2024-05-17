/** Customer for Lunchly */

import db from "../db.js";
import Reservation from "./reservation.js";

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
    this.fullName = this.getFullName();
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id,
                  first_name AS "firstName",
                  last_name  AS "lastName",
                  phone,
                  notes
           FROM customers
           ORDER BY last_name, first_name`,
    );
    return results.rows.map(c => new Customer(c));
  }

  /** Find customers by search string
   *
   * Returns an array of customer instances that match the
   * search query: [{cust1}, {cust2}, ...]
  */

  static async getAllCustomersBySearch(search) {

    const results = await db.query(
      `
      SELECT id,
                first_name AS "firstName",
                last_name  AS "lastName",
                phone,
                notes
            FROM customers
            WHERE first_name || ' ' || last_name ILIKE $1
            ORDER BY last_name, first_name
            `,
      ["%" + search + "%"]
    );
    return results.rows.map(c => new Customer(c));
  }

  /** Get a list of the top ten customers
   *
   * Returns an array of customer instances: [{cust1}, {cust2}, ...]
  */
  static async getBestCustomers() {

    const results = await db.query(
      `
      SELECT c.id,
                c.first_name AS "firstName",
                c.last_name  AS "lastName",
                c.phone,
                c.notes
            FROM customers AS c
              JOIN reservations AS r ON c.id = r.customer_id
            GROUP BY c.id
            ORDER BY count(r.id) DESC
            LIMIT 10
            `,
    );

    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id,
                  first_name AS "firstName",
                  last_name  AS "lastName",
                  phone,
                  notes
           FROM customers
           WHERE id = $1`,
      [id],
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** Save this customer to the DB.
   * This adds a customer if they are not located already in the DB.
   * Otherwise we update the customer's information for:
   * first name, last name, phone, and notes.
  */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes],
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers
             SET first_name=$1,
                 last_name=$2,
                 phone=$3,
                 notes=$4
             WHERE id = $5`, [
        this.firstName,
        this.lastName,
        this.phone,
        this.notes,
        this.id,
      ],
      );
    }
  }

  /** get the customer's first and last name */

  getFullName() {
    return this.firstName + " " + this.lastName;
  }
}

export default Customer;
