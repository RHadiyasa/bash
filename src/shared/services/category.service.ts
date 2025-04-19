import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { IResponseApi } from '@/types/common/responseHttp.interface';
import { IRequestGetUnit, IResponseGetUnitList } from '@/types/services/unit/getUnit.interface';
import { IRequestUpdateUnit } from '@/types/services/unit/updateUnit.interface';
import { IRequestCreateCategory } from '@/types/services/category/createCategory.interface';
import { IRequestCategoryList, IResponseCategoryList } from '@/types/services/category/getCategoryList.interface';
import { IRequestUpdateCategory } from '@/types/services/category/updateCategory.interface';

const BASE_URL = process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE || 'http://localhost:3003/api';

export const createCategory = async (dto: IRequestCreateCategory): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.post(
      BASE_URL + '/category',
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

export const getCategoryList = async (dto: IRequestCategoryList): Promise<IResponseCategoryList> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<IResponseCategoryList>> = await axios.get(BASE_URL + '/category', {
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

export const updateCategory = async (dto: IRequestUpdateCategory): Promise<void> => {
  try {
    const token = Cookies.get('token');
    const response: AxiosResponse<IResponseApi<any>> = await axios.patch(
      BASE_URL + '/category/' + dto.id,
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
