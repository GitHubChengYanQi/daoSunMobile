import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from './index.less';
import Icon from '../../../../../../../../components/Icon';
import { ExclamationCircleFill } from 'antd-mobile-icons';
import WaitInstock from './components/WaitInstock';
import OneInStock from './components/OneInStock';
import InstockError from './components/InstockError';
import Error from '../Error';

const InstockShop = (
  {
    actionId,
    id,
    refresh = () => {
    },
  }) => {


  const [content, setContent] = useState();

  return <div>
    <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }}
      className={style.float}
    >
      <div className={style.actions}>
        <div className={style.action} onClick={() => {

          // 待入库
          setContent(<WaitInstock
            refresh={refresh}
            actionId={actionId}
            instockOrderId={id}
            onClose={() => {
              setContent(null);
            }}
            onInstock={(item) => {

              // 单个入库
              setContent(<OneInStock
                refresh={refresh}
                actionId={actionId}
                instockOrderId={id}
                skuItem={item}
                onClose={() => {
                  setContent(null);
                }} />);
            }} />);
        }}>
          <div className={style.actionButton}><Icon type='icon-rukuguanli2' /></div>
          <span className={style.text}>待入</span>
        </div>
        <div className={style.action} onClick={() => {
          setContent(<InstockError
            instockOrderId={id}
            refresh={refresh}
            onClose={() => setContent(null)}
            onEdit={(id) => {

              // 修改入库异常
              setContent(<Error
                id={id}
                onClose={() => {
                  setContent(null);
                }}
                refreshOrder={() => {
                  refresh();
                }}
                onSuccess={() => {
                  setContent(null);
                }}
              />);
            }}
          />);
        }}>
          <div className={style.actionButton}><ExclamationCircleFill style={{ color: 'red' }} /></div>
          <span className={style.text}>异常</span>
        </div>
      </div>
    </FloatingBubble>


    <Popup
      mask
      visible={content}
    >
      {content}
    </Popup>
  </div>;
};

export default InstockShop;
