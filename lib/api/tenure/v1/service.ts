import { config } from '@mtfh/common/lib/config';
import {
  AxiosSWRConfiguration,
  AxiosSWRResponse,
  mutate,
  useAxiosSWR,
} from '@mtfh/common/lib/hooks';
import { axiosInstance } from '@mtfh/common/lib/http';
import { HouseholdMember, Tenure, TenureAsset, TenureType } from './types';

export const useTenure = (
  id: string | null,
  options?: AxiosSWRConfiguration<Tenure>
): AxiosSWRResponse<Tenure> => {
  return useAxiosSWR(id && `${config.tenureApiUrlV1}/tenures/${id}`, options);
};

export interface TenureParams {
  startOfTenureDate: string;
  endOfTenureDate?: string | null;
  tenureType: TenureType;
}

export interface AddTenureParams extends TenureParams {
  tenuredAsset: TenureAsset;
}

export const addTenure = async (params: AddTenureParams): Promise<Tenure> => {
  const { data: tenure } = await axiosInstance.post<Tenure>(
    `${config.tenureApiUrlV1}/tenures`,
    params
  );
  mutate(`${config.tenureApiUrlV1}/tenures/${tenure.id}`, tenure, false);

  return tenure;
};

export interface AddPersonToTenureParams {
  etag: string;
  tenureId: string;
  householdMember: HouseholdMember;
}

export const addPersonToTenure = async (
  params: AddPersonToTenureParams
): Promise<HouseholdMember> => {
  const { data: householdMember } = await axiosInstance.patch<HouseholdMember>(
    `${config.tenureApiUrlV1}/tenures/${params.tenureId}/person/${params.householdMember.id}`,
    { ...params.householdMember, etag: params.etag }
  );
  return householdMember;
};

export interface EditTenureParams extends Partial<TenureParams> {
  id: string;
  etag: string;
}

export const editTenure = async ({
  id,
  ...data
}: EditTenureParams): Promise<void> => {
  const response = await axiosInstance.patch(
    `${config.tenureApiUrlV1}/tenures/${id}`,
    data
  );
  return response.data;
};
