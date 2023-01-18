import React, { useState } from 'react';
import { SideBar } from 'antd-mobile';
import MyAntPopup from '../../../../../components/MyAntPopup';
import LinkButton from '../../../../../components/LinkButton';
import { ReceiptsEnums } from '../../../../../Receipts';
import style from './index.less';
import { classNames } from '../../../../../../util/ToolUtil';
import { CheckOutline } from 'antd-mobile-icons';

const TaskTypes = (
  {
    zIndex,
    visible,
    value,
    onClose = () => {
    },
    onChange = () => {
    },
  },
) => {

  const allTypes = [
    { label: '全部', value: 'all' },
  ];

  const erpTypes = [
    { label: '入库', value: ReceiptsEnums.instockOrder },
    { label: '出库', value: ReceiptsEnums.outstockOrder },
    { label: '异常', value: ReceiptsEnums.error },
    { label: '盘点', value: ReceiptsEnums.stocktaking },
    { label: '养护', value: ReceiptsEnums.maintenance },
    { label: '调拨', value: ReceiptsEnums.allocation },
  ];

  const [activeKey, setActiveKey] = useState('all');

  const [types, setTypes] = useState([...allTypes, ...erpTypes]);

  const [type, setType] = useState(value);

  const sideBars = [
    { title: '全部', key: 'all' },
    { title: '仓储中心', key: 'erp' },
    { title: '采购中心', key: 'purchase' },
    { title: '生产中心', key: 'production' },
  ];

  return <>
    <MyAntPopup
      onClose={onClose}
      zIndex={zIndex}
      title='任务类型'
      visible={visible}
      leftText={<LinkButton onClick={onClose}>取消</LinkButton>}
      rightText={<LinkButton onClick={() => {
        onChange({ key: type, title: types.find(item => item.value === type)?.label || '全部' });
      }}>确定</LinkButton>}
    >
      <div className={style.flexCenter}>
        <SideBar
          activeKey={activeKey}
          onChange={key => {
            switch (key) {
              case 'all':
                setTypes([...allTypes, ...erpTypes]);
                break;
              case 'erp':
                setTypes([
                  { label: '全部', value: 'all' },
                  ...erpTypes,
                ]);
                break;
              default:
                setTypes([]);
                break;
            }
            setActiveKey(key);
          }}
        >
          {
            sideBars.map(item => {
              return <SideBar.Item
                key={item.key}
                title={item.title}
              />;
            })
          }
        </SideBar>
        <div className={style.types}>
          {
            types.map((item, index) => {
              const checked = (type ? type === item.value : item.value === 'all');
              return <div
                key={index}
                className={classNames(checked && style.checked, style.check)}
                onClick={() => {
                  setType(item.value === 'all' ? null : item.value);
                }}
              >
                {item.label}
                <div hidden={!checked} className={style.svg}>
                  <CheckOutline style={{ color: 'var(--adm-color-primary)' }} />
                </div>
              </div>;
            })
          }
        </div>
      </div>
    </MyAntPopup>
  </>;
};

export default TaskTypes;
