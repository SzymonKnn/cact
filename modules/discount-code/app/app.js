// JOURNEY BUILDER CUSTOM ACTIVITY - discount-code ACTIVITY
// ````````````````````````````````````````````````````````````
// SERVER SIDE IMPLEMENTATION
//
// This example demonstrates
// * Configuration Lifecycle Events
//    - save
//    - publish
//    - validate
// * Execution Lifecycle Events
//    - execute
//    - stop

import express from "express";

import configJSON from "../config/config-json.js";
import { decodeJwt } from "../../common/jwt.js";

// setup the discount-code example app
/**
 *
 * @param app
 * @param options
 */
export default function discountCodeExample(app, options) {
  const moduleDirectory = `${options.rootDirectory}/modules/discount-code`;

  // setup static resources
  app.use(
    "/modules/discount-code/dist",
    express.static(`${moduleDirectory}/dist`)
  );
  app.use(
    "/modules/discount-code/images",
    express.static(`${moduleDirectory}/images`)
  );

  // setup the index redirect
  app.get("/modules/discount-code/", function (_, result) {
    return result.redirect("/modules/discount-code/index.html");
  });

  // setup index.html route
  app.get("/modules/discount-code/index.html", function (_, result) {
    // you can use your favorite templating library to generate your html file.
    // this example keeps things simple and just returns a static file
    return result.sendFile(`${moduleDirectory}/html/index.html`);
  });

  // setup config.json route
  app.get("/modules/discount-code/config.json", function (request, result) {
    // Journey Builder looks for config.json when the canvas loads.
    // We'll dynamically generate the config object with a function
    return result.status(200).json(configJSON(request));
  });

  // ```````````````````````````````````````````````````````
  // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
  //
  // CONFIGURATION
  // ```````````````````````````````````````````````````````
  // Reference:
  // https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

  /**
   * Called when a journey is saving the activity.
   * @returns {[type]}     [description]
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post("/modules/discount-code/save", decodeJwt, function (_, result) {
    console.log("debug: /modules/discount-code/save");
    return result.status(200).json({});
  });

  /**
   * Called when a Journey has been published.
   * This is when a journey is being activiated and eligible for contacts
   * to be processed.
   * @returns {[type]}     [description]
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post("/modules/discount-code/publish", decodeJwt, function (_, result) {
    console.log("debug: /modules/discount-code/publish");
    return result.status(200).json({});
  });

  /**
   * Called when Journey Builder wants you to validate the configuration
   * to ensure the configuration is valid.
   * @returns {[type]}
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post("/modules/discount-code/validate", decodeJwt, function (_, result) {
    console.log("debug: /modules/discount-code/validate");
    return result.status(200).json({});
  });

  // ```````````````````````````````````````````````````````
  // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
  //
  // EXECUTING JOURNEY
  // ```````````````````````````````````````````````````````

  /**
   * Called when a Journey is stopped.
   * @returns {[type]}
   */
  app.post("/modules/discount-code/stop", decodeJwt, function (_, result) {
    console.log("debug: /modules/discount-code/stop");
    return result.status(200).json({});
  });

  /**
   * Called when a contact is flowing through the Journey.
   * @returns {[type]}
   * 200 - Processed OK
   * 3xx - Contact is ejected from the Journey.
   * 4xx - Contact is ejected from the Journey.
   * 5xx - Contact is ejected from the Journey.
   */
  app.post(
    "/modules/discount-code/execute",
    decodeJwt,
    function (request_, result) {
      console.log("debug: /modules/discount-code/execute");

      const request = request_.body;

      console.log(" req.body", JSON.stringify(request_.body));

      // Find the in argument
      /**
       *
       * @param k
       */
      function getInArgument(k) {
        if (request && request.inArguments) {
          for (let index = 0; index < request.inArguments.length; index++) {
            let arguments_ = request.inArguments[index];
            if (k in arguments_) {
              return arguments_[k];
            }
          }
        }
      }

      // example: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/example-rest-activity.htm
      const discountInArgument = getInArgument("discount") || "nothing";
      const responseObject = {
        discount: discountInArgument,
        discountCode: generateRandomCode() + `-${discountInArgument}%`,
      };

      console.log("Response Object", JSON.stringify(responseObject));

      return result.status(200).json(responseObject);
    }
  );
}

/**
 * Generate a random discount code.
 *
 * Note: This function is for demonstration purposes only and is not designed
 * to generate real random codes. The first digit is always A, B, C, D, or E.
 * @returns {object}
 *
 * Example Response Object
 * {
 *    "discount":"15",
 *    "discountCode":"ADUXN-96454-15%"
 * }
 */
function generateRandomCode() {
  // eslint-disable-next-line unicorn/prefer-code-point
  let toReturn = String.fromCharCode(65 + Math.random() * 5);
  for (let index = 0; index < 4; index++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    toReturn += String.fromCharCode(65 + Math.random() * 25);
  }
  return toReturn + "-" + Math.round(Math.random() * 99_999, 0);
}
