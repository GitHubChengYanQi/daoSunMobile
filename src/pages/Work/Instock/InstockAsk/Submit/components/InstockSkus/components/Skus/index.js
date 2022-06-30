import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import MyEmpty from '../../../../../../../../components/MyEmpty';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import SkuItem from '../../../../../../../Sku/SkuItem';
import { RemoveButton } from '../../../../../../../../components/MyButton';
import ShopNumber from '../../../../../coponents/SkuInstock/components/ShopNumber';
import { Divider } from 'antd-mobile';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import { useBoolean } from 'ahooks';

const Skus = (
  {
    skus,
    createTypeData = () => {
    },
    countNumber,
    skuList = [],
    judge,
    dataChange = () => {
    },
    setHiddenBottom = () => {
    },
  },
) => {


  const [allSku, { toggle }] = useBoolean();

  return <>
    <div className={style.skus}>
      <div className={style.skuHead}>
        <div className={style.headTitle}>
          物料明细
        </div>
        <div className={style.extra}>
          合计：
          <div>{skus.length}</div>类
          <div hidden={!countNumber}><span>{countNumber}</span>件</div>
        </div>
      </div>
      {skuList.length === 0 && <MyEmpty description={`暂无${createTypeData().type}物料`} />}
      {
        skuList.map((item, index) => {
          if (!allSku && index >= 3) {
            return null;
          }
          return <div
            key={index}
            className={ToolUtil.classNames(
              style.skuItem,
              (index !== (allSku ? skus.length - 1 : 2)) && style.skuBorderBottom,
            )}
          >
            <div className={style.item}>
              <SkuItem
                imgSize={60}
                skuResult={item.skuResult}
                extraWidth={judge ? '50px' : '130px'}
                otherData={createTypeData(item).otherData}
                more={createTypeData(item).more}
              />
            </div>
            <div className={style.action}>
              <RemoveButton onClick={() => {
                dataChange(skuList.filter(item => item.key !== index));
              }} />
              <div hidden={createTypeData().buttonHidden}>
                <ShopNumber
                  onBlur={() => {
                    setHiddenBottom(false);
                  }}
                  onFocus={() => {
                    setHiddenBottom(true);
                  }}
                  id={`stepper${index}`}
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
    </div>
  </>;
};

export default Skus;
