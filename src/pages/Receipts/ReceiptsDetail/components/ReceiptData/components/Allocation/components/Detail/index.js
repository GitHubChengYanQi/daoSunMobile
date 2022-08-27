import React, { useEffect, useState } from 'react';
import { Divider, Popup, Tabs } from 'antd-mobile';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import Data from '../../../../../../../../Work/Allocation/SelectStoreHouse/components/Data';
import style from '../../../../../../../../Work/Instock/InstockAsk/Submit/components/PurchaseOrderInstock/index.less';
import AllocationSkuItem from '../AllocationSkuItem';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import MyCard from '../../../../../../../../components/MyCard';
import { useBoolean } from 'ahooks';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { PositionShow } from '../PositionShow';
import LinkButton from '../../../../../../../../components/LinkButton';
import { useRequest } from '../../../../../../../../../util/Request';
import { Message } from '../../../../../../../../components/Message';
import { MyLoading } from '../../../../../../../../components/MyLoading';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import Prepare from '../../../OutStockOrder/components/Prepare';

export const transferInStorehouse = { url: '/allocation/transferInStorehouse', method: 'POST' };

const Detail = (
  {
    transfer,
    allocationId,
    out,
    hopeList = [],
    askList = [],
    carryAllocation,
    inLibraryList = [],
    distributionList = [],
    refresh = () => {
    },
  },
) => {
  const [key, setKey] = useState('out');

  const [allocation, setAllocation] = useState();

  useEffect(() => {
    if (distributionList.length > 0) {
      setKey('noDis');
    }
  }, [distributionList.length]);

  const [allSku, { toggle }] = useBoolean();

  const { loading, run } = useRequest(transferInStorehouse, {
    manual: true,
    onSuccess: () => {
      Message.successToast('调拨成功！', () => {
        setAllocation(false);
        refresh();
      });
    },
  });

  const askData = (array = [], view = true) => {
    return <div className={style.details}>
      {array.length === 0 && <MyEmpty />}
      {
        array.map((item, index) => {
          if (!allSku && index > 2) {
            return null;
          }
          return <AllocationSkuItem out={out} item={item} key={index} view={view} />;
        })
      }
      {array.length > 3 && <Divider className={style.allSku}>
        <div onClick={() => {
          toggle();
        }}>
          {
            allSku ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>}
    </div>;
  };

  const inLibraryListData = () => {
    return <div>
      {inLibraryList.length === 0 && <MyEmpty />}
      {
        inLibraryList.map((item, index) => {
          if (!allSku && index > 2) {
            return null;
          }
          return <div key={index} className={style.skuItem}>
            <SkuItem
              className={style.item}
              skuResult={item.skuResult}
              extraWidth='124px'
              otherData={[
                item.brandName,
                <PositionShow inPositionName={item.toPositionName} outPositionName={item.positionName} />,
              ]}
            />
            <div hidden={!carryAllocation} className={style.inLibrary}>
              {item.complete ? '已完成' : <LinkButton onClick={() => {
                if (transfer) {
                  run({
                    data: {
                      allocationId,
                      allocationCartParams:[{
                        skuId: item.skuId,
                        brandId: item.brandId,
                        storehouseId: item.storehouseId,
                        storehousePositionsId: item.storehousePositionsId,
                        toStorehousePositionsId: item.toPositionId,
                        number: item.number,
                        allocationId,
                      }],
                      toStorehousePositionsId: item.toPositionId,
                    },
                  });
                } else {
                  setAllocation({
                    skuResult: item.skuResult,
                    skuId: item.skuId,
                    brandId: item.brandId,
                    brandResult: { brandName: item.brandName },
                    positionId: item.positionId,
                    number: item.number,
                    positionName: item.positionName,
                    toPositionId: item.toPositionId,
                  });
                }
              }}>调拨</LinkButton>}
              <ShopNumber show value={item.complete ? item.num : item.number} />
            </div>

          </div>;
        })
      }
      {inLibraryList.length > 3 && <Divider className={style.allSku}>
        <div onClick={() => {
          toggle();
        }}>
          {
            allSku ?
              <UpOutline />
              :
              <DownOutline />
          }
        </div>
      </Divider>}
    </div>;
  };

  const tabItems = distributionList.length > 0 ? [
    { key: 'noDis', title: '未分配' },
    { key: 'out', title: '调出明细' },
    { key: 'in', title: '调入明细' },
    { key: 'all', title: '库内调拨' },
  ] : [
    { key: 'out', title: '调出明细' },
    { key: 'in', title: '调入明细' },
    { key: 'all', title: '库内调拨' },
    { key: 'noDis', title: '未分配' },
  ];


  const content = () => {
    switch (key) {
      case 'out':
        return <Data noStoreHouse out={out} show noLink storeHouses={hopeList} />;
      case 'in':
        return <MyEmpty />;
      case 'all':
        return inLibraryListData();
      case 'noDis':
        return askData(distributionList, false);
      default:
        return <MyEmpty />;
    }
  };

  return <>

    <MyCard
      title='任务明细'
      className={style.cardStyle}
      headerClassName={ToolUtil.classNames(style.headerStyle, style.borderBottom)}
      bodyClassName={style.bodyStyle}
      extra={<Tabs
        className={style.tab}
        style={{
          '--title-font-size': '12px',
        }}
        activeKey={key}
        onChange={(key) => {
          setKey(key);
        }}
      >
        {
          tabItems.map((item) => {
            return <Tabs.Tab {...item} />;
          })
        }
      </Tabs>}>
      {content()}
    </MyCard>

    <Popup
      onMaskClick={() => setAllocation(false)}
      visible={allocation}
      destroyOnClose
    >
      <Prepare
        dimension='order'
        allocation
        skuItem={allocation}
        onSuccess={(data = []) => {
          const allocationCartParams = data.map(item => ({
            skuId: item.skuId,
            brandId: item.brandId,
            storehouseId: item.storehouseId,
            storehousePositionsId: item.storehousePositionsId,
            inkindId: item.inkindId,
            toStorehousePositionsId: allocation.toPositionId,
            number: item.number,
            allocationId,
          }));
          run({
            data: {
              allocationId,
              allocationCartParams,
              toStorehousePositionsId: allocation.toPositionId,
            },
          });
        }}
        onClose={() => {
          setAllocation(false);
        }}
      />
    </Popup>

    {loading && <MyLoading />}
  </>;
};

export default Detail;
