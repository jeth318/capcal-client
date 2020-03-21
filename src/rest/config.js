import dotenv from "dotenv";
dotenv.config();

const {
  VUE_APP_SYSTEMBOLAGET_API_HOST = "systembolaget-rest-api.jtdev.se",
  VUE_APP_API_HOST = "capcal.jtdev.se",
  VUE_APP_API_PROTOCOL = "https"
} = process.env;

export const apiBaseUrl = `${VUE_APP_API_PROTOCOL}://${VUE_APP_API_HOST}`;
export const systembolagetApiBaseUrl = `${VUE_APP_API_PROTOCOL}://${VUE_APP_SYSTEMBOLAGET_API_HOST}`;
