import React from 'react';
import style from '../../../PurchaseOrderInstock/index.less';
import { CalendarOutline } from 'antd-mobile-icons';
import { Radio, Space } from 'antd-mobile';
import Icon from '../../../../../../../../components/Icon';
import User from '../User';
import StartEndDate from '../../../../../../../Production/CreateTask/components/StartEndDate';
import Title from '../../../../../../../../components/Title';

const Stocktaking = (
  {
    value = {},
    onChange = () => {
    },
  },
) => {


  const method = [{ title: '明盘', key: 'OpenDisc' }, { title: '暗盘', key: 'DarkDisk' }];
  const mode = [{ title: '动态', key: 'dynamic' }, { title: '静态', key: 'staticState' }];

  return <>
    <User id={value.userId} name={value.userName} onChange={(id, name) => {
      onChange({ ...value, userId: id, userName: name });
    }} title='负责人' />

    <div className={style.dataItem}>
      <Title className={style.title}>盘点时间 <span>*</span></Title>
      <div>
        <StartEndDate
          split={<div>——</div>}
          value={[value.beginTime, value.endTime]}
          startShow={value.beginTime || <Space align='center'><CalendarOutline />起始</Space>}
          endShow={value.endTime || <Space align={'center'}><CalendarOutline />结束</Space>}
          onChange={(dates) => {
            onChange({ ...value, beginTime: dates[0], endTime: dates[1] });
          }}
        />
      </div>
    </div>

    <div className={style.dataItem}>
      <Title className={style.title}>方法 <span>*</span></Title>
      <div className={style.method}>
        {
          method.map((item, index) => {
            return <Radio
              icon={(checked) => {
                return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
              }}
              checked={value.method === item.key}
              key={index}
              style={{
                '--icon-size': '18px',
                '--font-size': '14px',
                '--gap': '6px',
              }}
              onChange={() => {
                onChange({ ...value, method: item.key });
              }}
            >
              {item.title}
            </Radio>;
          })
        }

      </div>
    </div>

    <div className={style.dataItem}>
      <Title className={style.title}>方式 <span>*</span></Title>
      <div className={style.mode}>
        {
          mode.map((item, index) => {
            return <Radio
              icon={(checked) => {
                return <Icon type={checked ? 'icon-a-danxuanxuanzhong' : 'icon-danxuanweixuanzhong'} />;
              }}
              checked={value.mode === item.key}
              key={index}
              style={{
                '--icon-size': '18px',
                '--font-size': '14px',
                '--gap': '6px',
              }}
              onChange={() => {
                onChange({ ...value, mode: item.key });
              }}
            >
              {item.title}
            </Radio>;
          })
        }

      </div>
    </div>

  </>;
};

export default Stocktaking;
