import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from './index.less';
import Icon from '../../../../../../../../components/Icon';
import WaitInstock from './components/WaitInstock';
import OneInStock from './components/OneInStock';
import InstockError from './components/InstockError';
import Error from '../Error';
import { WarningOutlined } from '@ant-design/icons';
import { ReceiptsEnums } from '../../../../../../../index';

const InstockShop = (
  {
    actionId,
    id,
    refresh = () => {
    },
  }) => {


  const [content, setContent] = useState();

  const wait = () => {
    setContent(<WaitInstock
      refresh={refresh}
      actionId={actionId}
      instockOrderId={id}
      onClose={() => {
        setContent(null);
      }}
      onInstock={(item, remainingQuantity) => {

        // 单个入库
        setContent(<OneInStock
          refresh={refresh}
          actionId={actionId}
          instockOrderId={id}
          skuItem={item}
          onClose={(complete) => {
            if (complete && (remainingQuantity === 1)) {
              setContent(null);
            } else {
              wait();
            }
          }} />);
      }} />);
  };

  const error = () => {
    setContent(<InstockError
      type={ReceiptsEnums.instockOrder}
      formId={id}
      refresh={refresh}
      onClose={() => setContent(null)}
      onEdit={(id, remainingQuantity) => {

        // 修改入库异常
        setContent(<Error
          type={ReceiptsEnums.instockOrder}
          id={id}
          onClose={(deleteAction) => {
            if (deleteAction && (remainingQuantity === 1)) {
              setContent(null);
            } else {
              error();
            }
          }}
          refreshOrder={() => {
            refresh();
          }}
        />);
      }}
    />);
  };

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
        <div id='waitInstock' className={style.action} onClick={() => {
          wait();
        }}>
          <div className={style.actionButton}><Icon type='icon-rukuguanli2' /></div>
          <span className={style.text}>待入</span>
        </div>
        <div className={style.action} onClick={() => {
          error();
        }}>
          <div className={style.actionButton}><WarningOutlined style={{ color: 'red' }} /></div>
          <span className={style.text}>异常</span>
        </div>
      </div>
    </FloatingBubble>


    <Popup
      onMaskClick={() => {
        setContent(null);
      }}
      mask
      visible={content}
    >
      {content}
    </Popup>
  </div>;
};

export default InstockShop;
