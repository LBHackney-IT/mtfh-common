import { CommonAuth, setAuth } from "../../../auth";
import { config } from "../../../config";
import { AxiosSWRConfiguration, useAxiosSWR } from "../../../http";
import {
  AddressAPIResponse,
  getAddressViaUprn,
  searchAddress,
  useAddressLookup,
} from "./service";
import { Address } from "./types";

const mockAxiosInstance = {
  get: jest.fn(),
};

jest.mock("../../../http", () => ({
  ...jest.requireActual("../../../http"),
  getAxiosInstance: jest.fn(() => mockAxiosInstance),
  useAxiosSWR: jest.fn(),
  mutate: jest.fn(),
}));

setAuth(new CommonAuth());

describe("searchAddress", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const postcode = "FK81FH";

    searchAddress(postcode);

    expect(mockAxiosInstance.get).toBeCalledWith(
      `${config.addressApiUrlV1}/addresses?postcode=${postcode}`,
      { headers: { "skip-x-correlation-id": true } },
    );
  });
});

describe("getAddressViaUprn", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const uprn = "0123456789";

    getAddressViaUprn(uprn);

    expect(mockAxiosInstance.get).toBeCalledWith(
      `${config.addressApiUrlV1}/addresses?uprn=${uprn}`,
      { headers: { "skip-x-correlation-id": true } },
    );
  });
});

describe("useAddressLookup", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const returnedValue: Address = {
      line1: "35 Weir Street",
      line2: "",
      line3: "",
      line4: "",
      town: "Stirling",
      postcode: "FK81FH",
      UPRN: 1234,
    };
    const postcode = "FK81FH";
    const options: AxiosSWRConfiguration<AddressAPIResponse> = {
      timeout: 5000,
      headers: {
        "skip-x-correlation-id": true,
      },
    };

    (useAxiosSWR as jest.Mock).mockResolvedValueOnce(returnedValue);

    const response = await useAddressLookup(postcode, options);
    expect(useAxiosSWR).toBeCalledWith(
      `${config.addressApiUrlV1}/addresses?postcode=${postcode}`,
      options,
    );
    expect(response).toBe(returnedValue);
  });
});
