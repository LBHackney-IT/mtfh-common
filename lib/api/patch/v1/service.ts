import { config } from "@mtfh/common/lib/config";
import { axiosInstance } from "@mtfh/common/lib/http";

import { Patch, UpdatePatchesAndAreasRequest } from "./types";

export const getAllPatchesAndAreas = async (): Promise<Array<Patch>> => {
  return new Promise<Array<Patch>>((resolve, reject) => {
    axiosInstance
      .get<Array<Patch>>(`${config.patchesAndAreasApiUrlV1}/patch/all`, {
        headers: {
          "skip-x-correlation-id": true,
        },
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const getPatchOrAreaById = async (patchId: string): Promise<Patch> => {

  return new Promise<Patch>((resolve, reject) => {
    axiosInstance
      .get<Patch>(`${config.patchesAndAreasApiUrlV1}/patch/${patchId}`, {
        headers: {
          "skip-x-correlation-id": true,
        },
      })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export const addResponsibleEntityToPatch = async (
  patchId: string,
  responsibleEntityId: string,
  request: UpdatePatchesAndAreasRequest,
  patchVersion: string | null,
) => {
  const apiUrl = `${config.patchesAndAreasApiUrlV1}/patch/${patchId}/responsibleEntity/${responsibleEntityId}`;
  return axiosInstance.patch(apiUrl, request, {
    headers: {
      "If-Match": patchVersion,
    },
  });
};

export const deletePatchesAndAreasResponsibilities = async (
  patchId: string,
  responsibleEntityId: string,
): Promise<void> => {
  await axiosInstance.delete(
    `${config.patchesAndAreasApiUrlV1}/patch/${patchId}/responsibleEntity/${responsibleEntityId}`,
  );
};
