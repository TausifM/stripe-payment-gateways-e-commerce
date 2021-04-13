const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_6Kc8NbLLgHkyMJZr5sfGtj0j00glV1ulyy");
const uuid = require("uuid");
const app= express();


//middleware
app.use(express.json())
app.use(cors())

//routes
app.get("/", (req, res)=> {
    res.send("IT WORKS AT WEBSITE");
});

app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuid()

    return stripe.customers.create ({
        email: token.email,
        source: token.id
    })
    .then(customer => {
        stripe.charges.create(
            {
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'purchase of product.name',
            shipping:{
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        },
        {idempontencyKey}
        );
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
});

//listen

app.listen(8282, () => console.log("LISTENING AT PORT 8282"))



