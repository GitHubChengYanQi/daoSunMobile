import React, { useState } from 'react';
import style from './index.less';
import { ShopbagOutline } from 'antd-mobile-icons';
import { Badge, Button, Popup } from 'antd-mobile';
import SkuItem from '../../../../../../Sku/SkuItem';
import { ToolUtil } from '../../../../../../../components/ToolUtil';
import { RemoveButton } from '../../../../../../../components/MyButton';
import Number from '../../../../../../../components/Number';
import MyEmpty from '../../../../../../../components/MyEmpty';
import { useHistory } from 'react-router-dom';

const SkuShop = (
  {
    skus = [],
    setSkus = () => {
    },
  },
) => {

  const [visible, setVisible] = useState();

  const history = useHistory();

  return <>

    <Popup
      className={style.popup}
      visible={visible}
      onMaskClick={() => {
        setVisible(false);
      }}
    >
      <div className={style.popupTitle}>
        <div>
          选择明细
        </div>
        <div className={style.empty} />
        <div onClick={() => {
          setSkus([]);
        }}>
          <RemoveButton /> 全部清除
        </div>
      </div>

      <div className={style.skuList}>
        {skus.length === 0 && <MyEmpty description='请添加物料' />}
        {
          skus.map((item, index) => {
            const skuResult = item.skuResult || {};
            return <div key={index} className={style.skuItem}>
              <div className={style.sku}>
                <SkuItem
                  skuResult={skuResult}
                  imgSize={80}
                  gap={10}
                  extraWidth='124px'
                  otherData={item.customerName}
                />
              </div>
              <div className={style.action}>
                <RemoveButton onClick={() => {
                  const newSkus = skus.filter(skuItem => skuItem.skuId !== item.skuId);
                  setSkus(newSkus);
                }} />
                <div className={style.empty} />
                <div className={style.instockNumber}>
                  <Number
                    value={item.number}
                    placeholder='入库数量'
                    noBorder
                    className={style.number}
                    onChange={(number) => {
                      const newSkus = skus.map((skuItem) => {
                        if (skuItem.skuId === item.skuId) {
                          return { ...skuItem, number };
                        }
                        return skuItem;
                      });
                      setSkus(newSkus);
                    }}
                  />
                  {ToolUtil.isObject(skuResult.spuResult && skuResult.spuResult.unitResult).unitName}
                </div>

              </div>
            </div>;
          })
        }
      </div>

    </Popup>

    <div className={style.bottom}>
      <div className={style.bottomMenu}>
        <div className={style.shop} onClick={() => {
          setVisible(!visible);
        }}>
          <Badge content={skus.length || null} color='#FA8F2B' style={{ '--top': '5px', '--right': '3px' }}>
            <ShopbagOutline style={{ color: skus.length > 0 && 'var(--adm-color-primary)' }} />
          </Badge>
          <div>已选<span>{skus.length}</span>类</div>
        </div>
        <Button
          disabled={skus.length === 0}
          color='primary'
          className={style.submit}
          onClick={() => {
            history.push({
              pathname: '/Work/Instock/InstockAsk/Submit',
              state: {
                skus,
              },
            });
          }}>确认
        </Button>
      </div>
    </div>
  </>;
};

export default SkuShop;
