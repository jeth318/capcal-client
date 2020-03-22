import axios from "axios";
import { getSystembolagetApiBaseUrl } from "./config";
import https from "https";

export const performSearch = async data => {
  const config = {
    url: `${getSystembolagetApiBaseUrl()}/products/custom`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    data: JSON.stringify({ namn: data })
  };
  return await axios(config);
};

export const fetchProductImage = async productId => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  return await axios.get(
    `${getSystembolagetApiBaseUrl()}/products/image/${productId}`,
    { httpsAgent: agent }
  );
};
