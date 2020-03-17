import axios from "axios";

export const addBeveragesToDb = async data => {
  console.log("addBeveragesToDb");

  const config = {
    url: "http://localhost:4040/api/caps",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    data: JSON.stringify({ ...data, userId: "5e6ea7b8be28b97e97834055" })
  };
  return await axios(config);
};

export const getAllCaps = async () => {
  const config = {
    url: "http://localhost:4040/api/caps",
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
  return await axios(config);
};
