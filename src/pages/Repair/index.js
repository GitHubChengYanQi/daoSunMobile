import { Skeleton } from 'weui-react-v2';
import { useState } from 'react';
import RepairItem from '@/pages/Repair/RepairItem';
import { Icon, NavBar } from 'antd-mobile';
import { router } from 'umi';

const Repair = () => {

  return(
    <>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => {router.goBack();}}
        // rightContent={[
        //   <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
        //   <Icon key="1" type="ellipsis" />,
        // ]}
      >工单列表</NavBar>
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={1}
        progress={1}
      />
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={2}
        progress={2}
      />
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={3}
        progress={3}
      />
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={4}
        progress={4}
      />
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={0}
        progress={0}
      />
      <RepairItem
        compnay='aaaaa'
        items='bbbbb'
        brand='ccccc'
        address='dddd'
        type='eeeeee'
        id={5}
        progress={5}
      />
      {/*<Skeleton*/}
      {/*  title*/}
      {/*  row={5}*/}
      {/*  loading={pages===1 && loading}>*/}
      {/*  <div>*/}
      {/*    {*/}
      {/*      repairAll.length > 0 ? repairAll.map((item, index) => {*/}
      {/*        return (*/}
      {/*          <RepairItem*/}
      {/*            key={index}*/}
      {/*            compnay={item.customerResult && item.customerResult.customerName}*/}
      {/*            items={item.deliveryDetailsResult && item.deliveryDetailsResult.detailesItems && item.deliveryDetailsResult.detailesItems.name}*/}
      {/*            brand={item.deliveryDetailsResult && item.deliveryDetailsResult.detailsBrand && item.deliveryDetailsResult.detailsBrand.brandName}*/}
      {/*            address={item.regionResult[0] && item.regionResult[0].province + "-" + item.regionResult[0].city + "-" + item.regionResult[0].area + "-" + item.address}*/}
      {/*            type={item.serviceType}*/}
      {/*            id={item.repairId}*/}
      {/*            progress={item.progress}*/}
      {/*          />*/}
      {/*        )*/}
      {/*      }) : <div className='position'>暂无数据</div>*/}
      {/*    }*/}
      {/*  </div>*/}
      {/*</Skeleton>*/}


    </>
  );

};
export default Repair;