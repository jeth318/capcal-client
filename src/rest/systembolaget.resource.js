import axios from "axios";

export const performSearch = async data => {
  const config = {
    url: "http://localhost:5555/products/custom",
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
    return await axios('http://localhost:5555/products/image/' + productId);
  };