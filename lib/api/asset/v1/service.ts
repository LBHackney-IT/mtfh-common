import { config } from "@mtfh/common/lib/config";
import {
  AxiosSWRConfiguration,
  AxiosSWRResponse,
  axiosInstance,
  useAxiosSWR,
} from "@mtfh/common/lib/http";

import { Asset, AssetAddress } from "./types";

export const useAsset = (
  id: string | null,
  options?: AxiosSWRConfiguration<Asset>,
): AxiosSWRResponse<Asset> => {
  return useAxiosSWR(id && `${config.assetApiUrlV1}/assets/${id}`, options);
};

export const patchAsset = async (
  id: string,
  assetAddress: AssetAddress,
  assetVersion: string,
): Promise<void> => {
  await axiosInstance
    .patch(`${config.assetApiUrlV1}/assets/${id}/address`, assetAddress, {
      headers: {
        "If-Match": assetVersion,
      },
    })
    .catch((error) => error);
};
