import jwt from "jsonwebtoken";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const secretClient = new SecretManagerServiceClient();

let _jwtToken;

/**
 *
 * @param request
 * @param result
 * @param next
 */
export async function decodeJwt(request, result, next) {
  const localToken = await getJwtToken();
  if (!request.body) {
    result.status(500).send("Body was empty");
  }
  if (!localToken) {
    result.status(500).send("JWT Signature not found to decode");
  }
  try {
    request.body = jwt.verify(request.body.toString("utf8"), localToken, {
      algorithm: "HS256",
    });
    return next();
  } catch (error) {
    console.error("JWT ERROR", error);
    console.error("JWT PAYLOAD", request.body);
    console.error("JWT KEY", localToken);

    result.status(401).send("JWT was not correctly signed");
  }
}

/**
 *
 */
async function getJwtToken() {
  if (!_jwtToken) {
    const project = await secretClient.getProjectId();
    const [version] = await secretClient.accessSecretVersion({
      name: `projects/${project}/secrets/SFMC_ACTIVITY_JWT/versions/latest`,
    });
    _jwtToken = version.payload.data.toString("utf8");
  }
  return _jwtToken;
}
