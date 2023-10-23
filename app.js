import express from "express";
import path from "node:path";
import bodyParser from "body-parser";
import * as url from "node:url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//modules
import discountCodeExample from "./modules/discount-code/app/app.js";
import splitExample from "./modules/discount-redemption-split/app/app.js";

const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/jwt" }));
app.get("/test", function (request, result) {
  result.send({
    status: "ok",
    request: { url: request.url, method: request.method, query: request.query, params: request.params },
  });
});

app.set("port", Number.parseInt(process.env.PORT) || 3000);
app.use("/", express.static(path.join(__dirname, "home")));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@salesforce-ux/design-system/assets')));

for (const sm of [discountCodeExample, splitExample])
  sm(app, {
    rootDirectory: __dirname,
  });
app.listen(app.get('port'), function () {
  console.log(`Express is running at localhost:${app.get('port')}`);
});