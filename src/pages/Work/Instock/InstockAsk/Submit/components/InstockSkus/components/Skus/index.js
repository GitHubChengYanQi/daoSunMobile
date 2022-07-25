import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../Sku/SkuItem';
import ShopNumber from '../../../../../coponents/SkuInstock/components/ShopNumber';
import { Divider } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';
import MyRemoveButton from '../../../../../../../../components/MyRemoveButton';
import MyCard from '../../../../../../../../components/MyCard';

const Skus = (
  {
    skus,
    createTypeData = () => {
    },
    countNumber = 0,
    skuList = [],
    judge,
    dataChange = () => {
    },
  },
) => {


  const [allSku, { toggle }] = useBoolean();

  return <>
    <MyCard title='物料明细' extra={<div className={style.extra}>
      合计：
      <div>{skus.length}</div>类
      <div hidden={!countNumber}><span>{countNumber}</span>件</div>
    </div>}>
      {skuList.length === 0 && <MyEmpty description={`暂无${createTypeData().type}物料`} />}
      {
        skuList.map((item, index) => {
          if (!allSku && index >= 3) {
            return null;
          }
          return <div
            key={index}
            style={{padding:'8px 0'}}
            className={ToolUtil.classNames(
              style.skuItem,
              (skuList.length > 3) && (index !== (allSku ? skus.length - 1 : 2)) && style.skuBorderBottom,
            )}
          >
            <div className={style.item}>
              <SkuItem
                skuResult={item.skuResult}
                extraWidth={judge ? '50px' : '130px'}
                otherData={createTypeData(item).otherData}
                more={createTypeData(item).more}
              />
            </div>
            <div className={style.action}>
              <MyRemoveButton onRemove={() => {
                dataChange(skuList.filter(item => item.key !== index));
              }} />
              <div hidden={createTypeData(item).buttonHidden}>
                <ShopNumber
                  value={item.number}
                  onChange={async (number) => {
                    const newData = skuList.map((dataItem) => {
                      if (dataItem.key === index) {
                        return { ...dataItem, number };
                      }
                      return dataItem;
                    });
                    dataChange(newData);
                  }}
                />
              </div>
            </div>
          </div>;
        })
      }
      {skuList.length > 3 && <Divider className={style.allSku}>
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
    </MyCard>
  </>;
};

export default Skus;
