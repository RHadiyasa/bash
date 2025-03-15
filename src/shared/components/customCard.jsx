import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import React from 'react';

const CustomCard = ({ title, number, type, footer }) => {
  return (
    <div className="w-full">
      <Card className="p-5">
        <CardHeader>
          <span className="text-sm lg:text-base font-semibold">{title}</span>
        </CardHeader>
        <CardBody>
          {!number && number ? (
            <div className="flex items-center gap-2 text-sm font-semibold">Loading data</div>
          ) : (
            <div>
              <div className="grid">
                <div className="flex items-end gap-2 font-bold md:text-xl lg:text-3xl">
                  <span>{number}</span>
                  <span className="font-semibold text-base">{type}</span>
                </div>
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter>
          <div className="text-sm mt-2">{footer}</div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomCard;
