import React, { useState } from 'react';
import style from './index.less';
import SkuItem from '../../../../../../../../Work/Sku/SkuItem';
import { ToolUtil } from '../../../../../../../../components/ToolUtil';
import ShopNumber from '../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button, Stepper } from 'antd-mobile';
import { LinkOutline } from 'antd-mobile-icons';
import Icon from '../../../../../../../../components/Icon';
import LinkButton from '../../../../../../../../components/LinkButton';
import { connect } from 'dva';

const Prepare = (
  {
    skuItem = {},
    dimension,
    onClose = () => {
    },
    onSuccess = () => {
    },
    ...props
  },
) => {

  console.log(props);

  const [positions, setpositions] = useState([11111111, 2222222, 3333333333, 4444444, 5555555]);

  const dimensionAction = () => {
    switch (dimension) {
      case 'order':
        return <div className={style.action}>
          {positions.map((item, index) => {
            return <div key={index}>
              <Button color='primary' fill='outline'><LinkOutline /> {item}</Button>
              <div className={style.allBrands}>
                {
                  [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
                    return <div className={style.brands} key={index}>
                      <span>品牌1</span>
                      <Stepper
                        style={{
                          '--button-text-color': '#000',
                        }}
                      />
                    </div>;
                  })
                }
              </div>

            </div>;
          })}
        </div>;
      default:
        return <></>;
    }
  };

  return <>

    <div className={style.header}>
      备料
    </div>

    <div
      className={style.skuItem}
    >
      <div className={style.item}>
        <SkuItem
          number={30}
          imgSize={60}
          skuResult={skuItem.skuResult}
          extraWidth='124px'
          otherData={ToolUtil.isObject(skuItem.bradnResult).brandName}
        />
      </div>
      <div className={style.scan}>
        <ShopNumber value={12} show />
        <LinkButton onClick={() => {
          props.dispatch({
            type: 'qrCode/wxCpScan',
          });
        }}><Icon type='icon-dibudaohang-saoma' style={{ fontSize: 24 }} /></LinkButton>
      </div>
    </div>
    {dimensionAction()}
    <div className={style.count}>
      合计：123
    </div>
    <div className={style.bottom}>
      <Button className={style.close} onClick={onClose}>取消</Button>
      <Button className={style.ok} onClick={() => {
        onSuccess();
      }}>确定</Button>
    </div>
  </>;
};

export default connect(({ qrCode }) => ({ qrCode }))(Prepare);
