// Takes the config and returns the config with the fully qualified paths based on the domain that is hosting it.
/**
 *
 * @param request
 */
export default function configJSON(request) {
  return {
    workflowApiVersion: "1.1",
    metaData: {
      // the location of our icon file
      icon: `images/icon.svg`,
      category: "customer",
    },
    // For Custom Activity this must say, "REST"
    type: "RESTDECISION",
    lang: {
      // Internationalize your language here!
      "en-US": {
        name: `Code Engagement${
          process.env?.npm_lifecycle_event == "dev" ? "-DEV" : ""
        }`,
        description: "Check the status of the discount code.",
      },
    },
    arguments: {
      execute: {
        inArguments: [
          {
            discountCode: "{{Interaction.discountCode}}",
          },
        ],
        outArguments: [],
        // Fill in the host with the host that this is running on.
        // It must run under HTTPS
        url: `https://${request.headers.host}/modules/discount-redemption-split/execute`,
        useJwt: true,
      },
    },
    configurationArguments: {
      save: {
        url: `https://${request.headers.host}/modules/discount-redemption-split/save`,
        useJwt: true,
      },
      publish: {
        url: `https://${request.headers.host}/modules/discount-redemption-split/publish`,
        useJwt: true,
      },
      validate: {
        url: `https://${request.headers.host}/modules/discount-redemption-split/validate`,
        useJwt: true,
      },
      stop: {
        url: `https://${request.headers.host}/modules/discount-redemption-split/stop`,
        useJwt: true,
      },
    },
    userInterfaces: {
      configInspector: {
        size: "scm-lg",
        emptyIframe: true,
      },
    },
    outcomes: [
      {
        arguments: {
          branchResult: "no_activity",
        },
        metaData: {
          label: "No Activity",
        },
      },
      {
        arguments: {
          branchResult: "viewed_item",
        },
        metaData: {
          label: "Viewed Item",
        },
      },
      {
        arguments: {
          branchResult: "abandoned_cart",
        },
        metaData: {
          label: "Abandoned Cart",
        },
      },
      {
        arguments: {
          branchResult: "purchased_item",
        },
        metaData: {
          label: "Purchased Item",
        },
      },
      {
        arguments: {
          branchResult: "invalid_code",
        },
        metaData: {
          label: "Invalid Code",
        },
      },
    ],
    schema: {
      arguments: {
        execute: {
          inArguments: [
            {
              discountCode: {
                dataType: "Text",
                direction: "in",
                access: "visible",
              },
            },
          ],
          outArguments: [],
        },
      },
    },
  };
}
