import dotenv from "dotenv";
dotenv.config();

const {
  VUE_APP_SYSTEMBOLAGET_API_HOST = "systembolaget-rest-api.jtdev.se",
  VUE_APP_SYSTEMBOLAGET_API_PORT = 5555,
  VUE_APP_API_PORT = 4040,
  VUE_APP_API_HOST = "capcal.jtdev.se",
  VUE_APP_API_PROTOCOL = "https",
  VUE_APP_LOCALDEV = false
} = process.env;

export const getApiBaseUrl = () => {
   let baseUrl = `${VUE_APP_API_PROTOCOL}://${VUE_APP_API_HOST}`;
   if (VUE_APP_LOCALDEV) {
       baseUrl += `:${VUE_APP_API_PORT}`;
   }
   return baseUrl;
};
export const getSystembolagetApiBaseUrl = () => {
    let baseUrl = `${VUE_APP_API_PROTOCOL}://${VUE_APP_SYSTEMBOLAGET_API_HOST}`;
    if (VUE_APP_LOCALDEV) {
        baseUrl += `:${VUE_APP_SYSTEMBOLAGET_API_PORT}`;
    }
    return baseUrl;
};
