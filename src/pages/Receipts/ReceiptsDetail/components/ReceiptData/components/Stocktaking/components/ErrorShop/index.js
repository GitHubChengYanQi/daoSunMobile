import React, { useState } from 'react';
import { FloatingBubble, Popup } from 'antd-mobile';
import style from '../../../InstockOrder/components/InstockShop/index.less';
import { WarningOutlined } from '@ant-design/icons';
import InstockError from '../../../InstockOrder/components/InstockShop/components/InstockError';
import Error from '../../../InstockOrder/components/Error';
import { ReceiptsEnums } from '../../../../../../../index';
import Icon from '../../../../../../../../components/Icon';

const ErrorShop = (
  {
    id,
    refresh = () => {
    },
  },
) => {

  const [content, setContent] = useState();

  const error = () => {
    setContent(<InstockError
      formId={id}
      refresh={refresh}
      type={ReceiptsEnums.stocktaking}
      onClose={() => setContent(null)}
      onEdit={(id, remainingQuantity) => {

        // 修改入库异常
        setContent(<Error
          type={ReceiptsEnums.stocktaking}
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

  return <>

    <FloatingBubble
      axis='xy'
      magnetic='x'
      style={{
        '--initial-position-bottom': '84px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }}
      className={style.float}
    >
      <div className={style.actions}>
        <div className={style.action} onClick={() => {
          error();
        }}>
          <div className={style.actionButton}><Icon type='icon-yichangkuang' /></div>
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

  </>;
};

export default ErrorShop;
