import { CommonAuth, setAuth } from "../../../auth";
import { config } from "../../../config";
import { AxiosSWRConfiguration, mutate, useAxiosSWR } from "../../../http";
import {
  AddPersonToTenureParams,
  AddTenureParams,
  EditTenureParams,
  RemovePersonFromTenureParams,
  addPersonToTenure,
  addTenure,
  editTenure,
  removePersonFromTenure,
  useTenure,
} from "./service";

import type { Tenure } from "./types";

const mockAxiosInstance = { patch: jest.fn(), post: jest.fn(), delete: jest.fn() };

jest.mock("../../../http", () => ({
  ...jest.requireActual("../../../http"),
  getAxiosInstance: jest.fn(() => mockAxiosInstance),
  useAxiosSWR: jest.fn(),
  mutate: jest.fn(),
}));

setAuth(new CommonAuth());

describe("addPersonToTenure", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const addPersonToTenureParams: AddPersonToTenureParams = {
      tenureId: "id",
      etag: "etag",
      householdMember: {
        id: "hhmid",
        dateOfBirth: "",
        fullName: "Paco el flaco",
        isResponsible: true,
        type: "Person",
        personTenureType: "HouseholdMember",
      },
    };
    addPersonToTenure(addPersonToTenureParams);
    expect(mockAxiosInstance.patch).toBeCalledWith(
      `${config.tenureApiUrlV1}/tenures/${addPersonToTenureParams.tenureId}/person/${addPersonToTenureParams.householdMember.id}`,
      {
        etag: addPersonToTenureParams.etag,
        ...addPersonToTenureParams.householdMember,
      },
    );
  });
});

describe("useTenure", () => {
  test("useTenure: it should send the right body to the API", async () => {
    const returnedValue = { tenureId: "" };
    const id = "id";
    const options: AxiosSWRConfiguration<Tenure> = { dedupingInterval: 10 };
    (useAxiosSWR as jest.Mock).mockResolvedValueOnce(returnedValue);

    const response = await useTenure(id, options);
    expect(useAxiosSWR).toBeCalledWith(`${config.tenureApiUrlV1}/tenures/${id}`, options);
    expect(response).toBe(returnedValue);
  });
});

describe("addTenure", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const params: AddTenureParams = {
      startOfTenureDate: "",
      tenureType: {
        code: "",
        description: "",
      },
      tenuredAsset: {
        id: "",
        type: "type",
        fullAddress: "",
        uprn: "",
        propertyReference: "",
      },
    };
    const tenureReturned = { id: "tenureId" };
    (mockAxiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: tenureReturned });

    const response = await addTenure(params);

    expect(mockAxiosInstance.post).toBeCalledWith(
      `${config.tenureApiUrlV1}/tenures`,
      params,
    );
    expect(mutate).toBeCalledWith(
      `${config.tenureApiUrlV1}/tenures/${tenureReturned.id}`,
      tenureReturned,
      false,
    );
    expect(response).toBe(tenureReturned);
  });
});

describe("removePersonFromTenure", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const params: RemovePersonFromTenureParams = {
      etag: "",
      tenureId: "id",
      householdMemberId: "hhmid",
    };

    removePersonFromTenure(params);

    expect(mockAxiosInstance.delete).toBeCalledWith(
      `${config.tenureApiUrlV1}/tenures/${params.tenureId}/person/${params.householdMemberId}`,
    );
  });
});

describe("editTenure", () => {
  test("it calls the api endpoint with the correct url and parameters", async () => {
    const params: EditTenureParams = {
      id: "id",
      etag: "",
    };
    const response = {
      data: {},
    };
    (mockAxiosInstance.patch as jest.Mock).mockResolvedValueOnce(response);
    const editTenureResponse = await editTenure(params);

    expect(mockAxiosInstance.patch).toBeCalledWith(
      `${config.tenureApiUrlV1}/tenures/${params.id}`,
      {
        etag: params.etag,
      },
    );
    expect(editTenureResponse).toBe(response.data);
  });
});
