import axios from "axios";
import { getSystembolagetApiBaseUrl } from './config';

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
  return await axios(
    `${getSystembolagetApiBaseUrl()}/products/image/${productId}`
  );
};
