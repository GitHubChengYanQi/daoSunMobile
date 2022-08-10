import React, { useRef, useState } from 'react';
import { Divider, PageIndicator, Swiper } from 'antd-mobile';
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

export const transferInStorehouse = { url: '/allocation/transferInStorehouse', method: 'POST' };

const Detail = (
  {
    allocationId,
    out,
    hopeList = [],
    askList = [],
    carryAllocation,
    skus = [],
    inLibraryList = [],
    total,
    refresh = () => {
    },
  },
) => {

  const [key, setKey] = useState(0);

  const [allSku, { toggle, setFalse }] = useBoolean();

  const swiperRef = useRef();

  const { loading, run } = useRequest(transferInStorehouse, {
    manual: true,
    onSuccess: () => {
      Message.successToast('调拨成功！', () => {
        refresh();
      });
    },
  });

  const askData = (array = []) => {
    return <div className={style.details}>
      {array.length === 0 && <MyEmpty />}
      {
        array.map((item, index) => {
          if (!allSku && index > 2) {
            return null;
          }
          return <AllocationSkuItem out={out} item={item} key={index} />;
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
                run({
                  data: {
                    allocationId,
                    skuId: item.skuId,
                    brandId: item.brandId,
                    storehousePositionsId: item.positionId,
                    toStorehousePositionsId: item.toPositionId,
                    number: item.number,
                  },
                });
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

  const tabItems = out ? [
    { key: 'outData', title: '调出明细' },
    { key: 'inData', title: '调入明细' },
    { key: 'inLibrary', title: '库内调拨' },
  ] : [
    { key: 'inData', title: '调入明细' },
    { key: 'outData', title: '调出明细' },
    { key: 'inLibrary', title: '库内调拨' },
  ];

  const swiperItem = () => {
    switch (key) {
      case 0:
        return askData(askList);
      case 1:
        return <Data show noLink storeHouses={hopeList} />;
      case 2:
        return inLibraryListData();
      default:
        return <MyEmpty />;
    }
  };

  const content = () => {
    return <Swiper
      direction='horizontal'
      loop
      indicator={() => null}
      ref={swiperRef}
      defaultIndex={key}
      onIndexChange={index => {
        setFalse();
        setKey(index);
      }}
    >
      {
        tabItems.map((item, index) => {
          return <Swiper.Item key={index}>
            {swiperItem()}
          </Swiper.Item>;
        })
      }
    </Swiper>;
  };

  return <>

    <MyCard
      title='任务明细'
      className={style.cardStyle}
      headerClassName={style.headerStyle}
      bodyClassName={style.bodyStyle}
      extra={<div className={style.extra}>
        <PageIndicator
          total={3}
          current={key}
        />
        {tabItems[key].title}
      </div>}>
      {content()}
    </MyCard>

    {loading && <MyLoading />}
  </>;
};

export default Detail;
