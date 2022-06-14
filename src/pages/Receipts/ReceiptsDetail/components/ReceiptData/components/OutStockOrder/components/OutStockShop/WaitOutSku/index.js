import React, { useState } from 'react';
import style from './index.less';
import LinkButton from '../../../../../../../../../components/LinkButton';
import MyCheck from '../../../../../../../../../components/MyCheck';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
import SkuItem from '../../../../../../../../../Work/Sku/SkuItem';
import ShopNumber from '../../../../../../../../../Work/Instock/InstockAsk/coponents/SkuInstock/components/ShopNumber';
import { Button } from 'antd-mobile';

const WaitOutSku = () => {

  const [sys, setSys] = useState();

  return <>
    <div className={style.header}>待出物料</div>
    <div className={style.sys}>
      <span>待出 200</span>
      <LinkButton onClick={() => {
        setSys(!sys);
      }}>{sys ? '取消管理' : '管理'}</LinkButton>
    </div>
    <div className={style.content}>
      {
        [1, 2, 3].map((item, index) => {
          return <div key={index}>
            <div className={style.user}>
              <span><MyCheck />领料人：xxx</span><LinkButton><SystemQRcodeOutline /></LinkButton>
            </div>

            {
              [1, 2, 3].map((item, index) => {
                return <div key={index}>
                  <div className={style.orderData}>
                    {sys && <span><MyCheck /></span>}xxx的出库申请 / qweqweqwe
                  </div>

                  {
                    [1, 2, 3].map((item, index) => {
                      return <div key={index}>
                        <div
                          className={style.skuItem}
                        >
                          {sys && <span><MyCheck /></span>}
                          <div className={style.item}>
                            <SkuItem
                              imgSize={60}
                              extraWidth='148px'
                            />
                          </div>
                          <div>
                            <ShopNumber value={11} show />
                          </div>
                        </div>
                      </div>;
                    })
                  }
                </div>;
              })
            }
          </div>;
        })
      }
    </div>

    <div className={style.bottom}>
      <div className={style.all}>
        <MyCheck onChange={() => {

        }}>{false ? '取消全选' : '全选'}</MyCheck> <span>已选中 {1} 种</span>
      </div>
      <div className={style.buttons}>
        <Button color='danger' fill='outline'>退回</Button>
        <Button
          color='primary'
          fill='outline'
          onClick={() => {

          }}
        >提交</Button>
      </div>
    </div>

  </>;
};

export default WaitOutSku;
