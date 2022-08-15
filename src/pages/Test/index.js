import React from 'react';
import Viewpager from '../Receipts/ReceiptsDetail/components/ReceiptData/components/InstockOrder/components/Viewpager';
import SkuItem from '../Work/Sku/SkuItem';

const Test = () => {

  const array = [1,2,3,4,5,6,7,8,9]

  return <div style={{ textAlign: 'center',backgroundColor:'#fff' }}>
    {
      [...array,...array].map((item,index)=>{
        return  <Viewpager
          key={index}
          currentIndex={index}
          onLeft={() => {

          }}
          onRight={() => {

          }}
        >
        <SkuItem />
        </Viewpager>
      })
    }
  </div>;
};

export default Test;
