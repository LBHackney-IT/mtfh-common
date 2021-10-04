const config = {
  authAllowedGroups: process.env.AUTH_ALLOWED_GROUPS?.split(",") || ["TEST_GROUP"],
  authDomain: process.env.AUTH_DOMAIN || "//auth.hackney.gov.uk/auth",
  cookieDomain: process.env.COOKIE_DOMAIN || "hackney.gov.uk",
  authToken: process.env.AUTH_TOKEN_NAME || "hackneyToken",
  configurationApiUrlV1: process.env.CONFIGURATION_API_URL_V1 || "",
  contactDetailsApiUrlV1: process.env.CONTACT_DETAILS_API_URL_V1 || "/api",
  personApiUrlV1: process.env.PERSON_API_URL_V1 || "/api/v1",
  personApiUrlV2: process.env.PERSON_API_URL_V2 || "/api/v2",
  notesApiUrlV1: process.env.NOTES_API_URL_V1 || "/api/v1",
  notesApiUrlV2: process.env.NOTES_API_URL_V2 || "/api/v2",
  tenureApiUrlV1: process.env.TENURE_API_URL_V1 || "/api",
  assetApiUrlV1: process.env.PROPERTY_API_URL_V1 || "/api/v1",
  referenceDataApiUrlV1: process.env.REFERENCE_DATA_API_URL_V1 || "/api/v1",
};

export default config;
