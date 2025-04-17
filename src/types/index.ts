import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IResponseApi<T> {
  responseCode : string
  message : string
  data : T
}