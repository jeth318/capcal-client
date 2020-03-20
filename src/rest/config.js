import dotenv from "dotenv";
dotenv.config();

const {
  VUE_APP_API_HOST = "localhost",
  VUE_APP_API_PORT = "4040",
  VUE_APP_API_PROTOCOL = "http"
} = process.env;

export const apiBaseUrl = `${VUE_APP_API_PROTOCOL}://${VUE_APP_API_HOST}:${VUE_APP_API_PORT}`;
