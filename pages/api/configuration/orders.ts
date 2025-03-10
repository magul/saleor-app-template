import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk/const";
import { withJWTVerified } from "@saleor/app-sdk/middleware";
import { withSentry } from "@sentry/nextjs";
import type { Handler } from "retes";
import { toNextHandler } from "retes/adapter";
import { Response } from "retes/response";

import { getValue } from "../../../lib/metadata";
import { withSaleorDomainMatch } from "../../../lib/middlewares";
import { getAppIdFromApi } from "../../../lib/utils";

const handler: Handler = async (request) => {
  const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

  let numberOfOrders;
  try {
    numberOfOrders = await getValue(saleorDomain, "NUMBER_OF_ORDERS");
  } catch (e: unknown) {
    const error = e as Error;
    console.error(error);
    return Response.InternalServerError({
      success: false,
      message: error.message,
    });
  }

  return Response.OK({ success: true, data: { number_of_orders: numberOfOrders } });
};

export default withSentry(
  toNextHandler([withSaleorDomainMatch, withJWTVerified(getAppIdFromApi), handler])
);
