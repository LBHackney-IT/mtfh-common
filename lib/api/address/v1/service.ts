import { config } from "../../../config";
import { AxiosSWRConfiguration, getAxiosInstance, useAxiosSWR } from "../../../http";

import type { Address } from "./types";

export interface AddressAPIResponse {
  data: { address: Address[] };
}

interface SearchAddressResponse {
  addresses?: Address[];
  error?: { code: number };
}

export const searchAddress = async (postCode: string): Promise<SearchAddressResponse> => {
  const axiosInstance = getAxiosInstance();

  return axiosInstance
    .get<AddressAPIResponse>(`${config.addressApiUrlV1}/addresses?postcode=${postCode}`, {
      headers: {
        "skip-x-correlation-id": true,
      },
    })
    .then((res) => ({ addresses: res.data.data.address }))
    .catch((res) => {
      if (res.message.toLowerCase().indexOf("network") !== -1) {
        return { error: { code: 500 } };
      }
      return res;
    });
};

export const getAddressViaUprn = async (UPRN: string): Promise<SearchAddressResponse> => {
  return new Promise<SearchAddressResponse>((resolve, reject) => {
    const axiosInstance = getAxiosInstance();

    axiosInstance
      .get<AddressAPIResponse>(`${config.addressApiUrlV1}/addresses?uprn=${UPRN}`, {
        headers: {
          "skip-x-correlation-id": true,
        },
      })
      .then((res) => resolve({ addresses: res.data.data.address }))
      .catch((error) => reject(error));
  });
};

export const useAddressLookup = (
  postCode?: string | null,
  options: AxiosSWRConfiguration<AddressAPIResponse> = {},
) => {
  return useAxiosSWR<AddressAPIResponse>(
    postCode ? `${config.addressApiUrlV1}/addresses?postcode=${postCode}` : null,
    {
      ...options,
      timeout: 5000,
      headers: {
        ...options.headers,
        "skip-x-correlation-id": true,
      },
    },
  );
};
