import express from "express";
import configJSON from "../config/config-json.js";

import { decodeJwt } from "../../common/jwt.js";
import weather from "../../common/weather.js";

// setup the split example app
/** xa
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

  app.get(
    "/modules/discount-redemption-split/test",
    function (request, result) {
      // Journey Builder looks for config.json when the canvas loads.
      // We'll dynamically generate the config object with a function
      //console.log("TEST");
      weather.getCityData('Warszawa').then(function(resp){
        console.log(resp.data[0].lat);
        console.log(resp.data[0].lon);
        weather.getCityWeather(resp.data[0].lon, resp.data[0].lat).then(function(weather){
          console.log(weather.data.current.temp)
          console.log(weather.data.current.temp > 15 ? "So hot!":"So cold!");
        }).catch((error)=>{
          console.log(error);
        })
      }).catch((error)=>{
        console.log(error);
      })
      return result.status(200).json();
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
      let city = getInArgument("City") || "Warsaw";
      let weatherCode = 0;

      weather.getCityData('Warszawa').then(function(resp){
        weather.getCityWeather(resp.data[0].lon, resp.data[0].lat).then(function(weather){
          weatherCode = weather.data.current.temp > 15 ? 1 : 0;
        }).catch((error)=>{
          console.log(error);
        })
      }).catch((error)=>{
        console.log(error);
      })

      console.log("discount code:", discountCode);
      console.log("city:", city);

      if (discountCode && discountCode.length > 0) {
        switch (weatherCode) {
          case 0: {
            console.log("So cold!");
            return result.status(200).json({ branchResult: "no_activity" });
          }
          case 1: {
            console.log("So hot!");
            return result.status(200).json({ branchResult: "viewed_item" });
          }
          case 2: {
            return result.status(200).json({ branchResult: "abandoned_cart" });
          }
          case 3: {
            return result.status(200).json({ branchResult: "purchased_item" });
          }
          case 4:
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
