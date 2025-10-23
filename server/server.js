const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const axios = require("axios");
require("dotenv").config();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const PARAFIN_BASE_URL = process.env.PARAFIN_BASE_URL;

const businessParafinId = process.env.BUSINESS_PARAFIN_ID;
const businessExternalId = process.env.BUSINESS_EXTERNAL_ID;
 // 1. Combine the ID and secret with a colon
const credentials = `${process.env.PARAFIN_CLIENT_ID}:${process.env.PARAFIN_CLIENT_SECRET}`;

// 2. Base64 encode the string
const base64Credentials = Buffer.from(credentials).toString('base64');

// 3. Construct the Authorization header value
const authorizationHeader = `Basic ${base64Credentials}`;

//console.log(authorizationHeader);

// route for fetching Parafin token
app.get("/parafin/token/:id/", async (req, res) => {
  const personId = req.params.id;
  const url = `${PARAFIN_BASE_URL}/auth/redeem_token`;
  console.log(personId);

  const data = {
    person_id: personId,
  };

  const config = {
    auth: {
      username: process.env.PARAFIN_CLIENT_ID,
      password: process.env.PARAFIN_CLIENT_SECRET,
    },
  };


  try {
    // make call to fetch Parafin token for business
    const result = await axios.post(url, data, config);
    const parafinToken = result.data.bearer_token;
    //console.log("result data in server:", result.data);

    res.send({
      parafinToken: parafinToken,
    });
  } catch (error) {
    console.log(error);
    res.send({
      errorCode: error.response.status,
      message: error.response.data,
    });
  }
});

/**
 * GET /offer
 * Requires the user to send a Bearer token in the Authorization header.
 * Example header: Authorization: Bearer <parafinToken>
 */
app.get("/offer", async (req, res) => {
  try {
    //  Extract Authorization header
    const authHeader = req.headers.authorization;
  //  console.log(" Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Missing or invalid Authorization header" });
    }

    //const parafinToken = authHeader.split(" ")[1]; // cleanly extract the token

    //  Make Parafin offer request
    const offersResponse = await axios.get(
      `${PARAFIN_BASE_URL}/capital_product_offers`,
      {
        params: {
          business_parafin_id: businessParafinId,
          business_external_id: businessExternalId,
        },
        headers: {
          Authorization: authorizationHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const { results, has_more } = offersResponse.data;

    if (!results || results.length === 0) {
      console.log(" No offers found");
      return res.send({ hasOffer: false, results: [] });
    }

    console.log(" Offers found:", results.length);
    return res.send({ hasOffer: true, has_more, results });
  } catch (error) {
    console.error(
      " Error fetching offers:",
      error.response?.data || error.message
    );
    const status = error.response?.status || 500;
    res.status(status).send({
      message: error.response?.data || "Error fetching offers",
    });
  }
});

// Starting Server
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on PORT: ${process.env.PORT || 8080}`);
});
