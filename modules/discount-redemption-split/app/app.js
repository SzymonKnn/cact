import express from "express";
import configJSON from "../config/config-json.js";

import { decodeJwt } from "../../common/jwt.js";

// setup the split example app
/**
 *
 * @param app
 * @param options
 */
export default function splitExample(app, options) {
  const moduleDirectory = `${options.rootDirectory}/modules/discount-redemption-split`;

  // setup static resources
  app.use(
    "/modules/discount-redemption-split/dist",
    express.static(`${moduleDirectory}/dist`)
  );
  app.use(
    "/modules/discount-redemption-split/images",
    express.static(`${moduleDirectory}/images`)
  );

  // setup the index redirect
  app.get("/modules/discount-redemption-split/", function (_, result) {
    return result.redirect("/modules/discount-redemption-split/index.html");
  });

  // setup index.html route
  app.get(
    "/modules/discount-redemption-split/index.html",
    function (_, result) {
      // you can use your favorite templating library to generate your html file.
      // this example keeps things simple and just returns a static file
      return result.sendFile(`${moduleDirectory}/html/index.html`);
    }
  );

  // setup config.json route
  app.get(
    "/modules/discount-redemption-split/config.json",
    function (request, result) {
      // Journey Builder looks for config.json when the canvas loads.
      // We'll dynamically generate the config object with a function
      return result.status(200).json(configJSON(request));
    }
  );

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
  app.post(
    "/modules/discount-redemption-split/save",
    decodeJwt,
    function (_, result) {
      console.log("debug: /modules/discount-redemption-split/save");
      return result.status(200).json({});
    }
  );

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
  app.post(
    "/modules/discount-redemption-split/publish",
    decodeJwt,
    function (_, result) {
      console.log("debug: /modules/discount-redemption-split/publish");
      return result.status(200).json({});
    }
  );

  /**
   * Called when Journey Builder wants you to validate the configuration
   * to ensure the configuration is valid.
   * @returns {[type]}
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post(
    "/modules/discount-redemption-split/validate",
    decodeJwt,
    function (_, result) {
      console.log("debug: /modules/discount-redemption-split/validate");
      return result.status(200).json({});
    }
  );

  // ```````````````````````````````````````````````````````
  // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
  //
  // EXECUTING JOURNEY
  // ```````````````````````````````````````````````````````

  /**
   * Called when a Journey is stopped.
   * @returns {[type]}
   */
  app.post(
    "/modules/discount-redemption-split/stop",
    decodeJwt,
    function (_, result) {
      console.log("debug: /modules/discount-redemption-split/stop");
      return result.status(200).json({});
    }
  );

  /**
   * Called when a contact is flowing through the Journey.
   * @returns {[type]}
   * 200 - Processed OK
   * 3xx - Contact is ejected from the Journey.
   * 4xx - Contact is ejected from the Journey.
   * 5xx - Contact is ejected from the Journey.
   */
  app.post(
    "/modules/discount-redemption-split/execute",
    decodeJwt,
    function (request_, result) {
      console.log("debug: /modules/discount-redemption-split/execute");

      var request = request_.body;

      console.log("req", request_ === undefined ? "empty" : "has");
      console.log("req.body", request_.body);

      // Find the in argument
      var getInArgument = (k) => {
        if (request_.body && request_.body.inArguments) {
          for (
            let index = 0;
            index < request_.body.inArguments.length;
            index++
          ) {
            let e = request_.body.inArguments[index];
            if (k in e) {
              return e[k];
            }
          }
        }
        console.log("Unable To Find In Argument:", k);
        return;
      };

      // example: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/example-rest-activity.htm
      let discountCode = getInArgument("discountCode") || "nothing";

      console.log("discount code:", discountCode);

      if (discountCode && discountCode.length > 0) {
        switch (discountCode[0]) {
          case "A": {
            console.log("");
            return result.status(200).json({ branchResult: "no_activity" });
          }
          case "B": {
            return result.status(200).json({ branchResult: "viewed_item" });
          }
          case "C": {
            return result.status(200).json({ branchResult: "abandoned_cart" });
          }
          case "D": {
            return result.status(200).json({ branchResult: "purchased_item" });
          }
          case "E":
          default: {
            return result.status(200).json({ branchResult: "invalid_code" });
          }
        }
      } else {
        // Fail the contact, we don't know this discount code.
        return result.status(500).json({ branchResult: "invalid_code" });
      }
    }
  );
}
