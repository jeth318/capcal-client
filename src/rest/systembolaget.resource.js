import axios from "axios";
import { systembolagetApiBaseUrl } from './config';

export const performSearch = async data => {
  const config = {
    url: `${systembolagetApiBaseUrl}/products/custom`,
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
    `${systembolagetApiBaseUrl}/products/image/${productId}`
  );
};
