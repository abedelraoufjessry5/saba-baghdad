/* Offers set from the app (on top of the ones set in Odoo with "Compare to
   Price"). Each line: the product id in Odoo (product.template), the offer
   price, the old price, and optionally the last day of the offer.

   The server uses these prices everywhere: lists, product page, cart and
   the order sent to Odoo - so the customer pays exactly what they saw.
   After the "until" day the offer stops by itself.

   Example: { id: 580, price: 45000, was: 50000, until: "2026-11-30" } */

export const OFFERS = [
  { id: 580, price: 45000, was: 50000 }, // Vichy Liftactiv B3 Serum 30ml
  { id: 351, price: 30000, was: 33000 }, // La Roche-Posay Effaclar Micro-Peeling Gel 200ml
  { id: 199, price: 50000, was: 55000 }, // Perfect Image Gly + Sal Body Lotion 240ml
  { id: 291, price: 50000, was: 55000 }  // Perfect Image Gly + Sal Body Lotion 240ml (2nd listing)
];
