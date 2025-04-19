import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestCreateUnit } from '@/types/services/unit/createUnit.interface';
import { IRequestGetUnit, IResponseGetUnitList } from '@/types/services/unit/getUnit.interface';
import { IRequestUpdateUnit } from '@/types/services/unit/updateUnit.interface';

const BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE || 'http://localhost:3003/api';

export const createUnit = async (dto: IRequestCreateUnit): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.post(
      BASE_URL + '/units',
      {
        ...dto,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const getUnitList = async (dto: IRequestGetUnit): Promise<IResponseGetUnitList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseGetUnitList>> = await axios.get(BASE_URL + '/units', {
      params: {
        ...dto,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};

export const updateUnit = async (dto: IRequestUpdateUnit): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/units/' + dto.id,
      {
        ...dto,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    } else {
      throw new Error(error);
    }
  }
};
