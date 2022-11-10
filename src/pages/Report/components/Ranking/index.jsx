import React, { useState } from 'react';
import styles from '../../InStockReport/index.less';
import { CaretUpFilled } from '@ant-design/icons';
import { RightOutline } from 'antd-mobile-icons';
import { classNames } from '../../../components/ToolUtil';
import { Button } from 'antd-mobile';
import Icon from '../../../components/Icon';

const Ranking = (
  {
    fontSize,
    title,
    modal,
    buttons = [],
    noIcon,
  },
) => {

  const [type, setType] = useState(buttons[0].key);

  return <div className={classNames(styles.card, styles.askNumber)}>
    <div className={styles.askNumberHeader}>
      <div className={styles.askNumberHeaderLabel} style={{ fontSize }}>
        <Icon hidden={noIcon} type='icon-rukuzongshu' />
        {title}
      </div>
      <div>
        <span hidden={modal !== 'inAskNumber'}>共 <span className='numberBlue'>6</span>人 </span>
        <span hidden={modal !== 'useNumber'}>共 <span className='numberBlue'>108</span>家 </span>
        <RightOutline />
      </div>
    </div>

    {
      [1, 2, 3].map((item, index) => {
        let leftText = '';
        let rightText = '';
        switch (type) {
          case 'outAskNumberTask':
          case 'inAskNumberTask':
            leftText = '张三（采购部-采购员）';
            rightText = '66 次';
            break;
          case 'outAskNumberSku':
          case 'inAskNumberSku':
            leftText = '张三（采购部-采购员）';
            rightText = '16 类 122 件';
            break;
          case 'useClass':
          case 'useNumber':
          case 'supplyClass':
          case 'supplyNumber':
            leftText = '沈阳第三机械装备制造有限公司';
            rightText = '16 类  122 件';
            break;
          case 'outStockClass':
          case 'inStockClass':
            leftText = '标准件';
            rightText = '16 类 122 件';
            break;
          case 'outStockType':
          case 'inStockType':
            leftText = '物料采购';
            rightText = '16 类 122 件';
            break;
          case 'outStockHouse':
          case 'inStockHouse':
            leftText = '南坡大库';
            rightText = '16 类 122 件';
            break;
          case 'outStockUser':
            leftText = '张三（生产制造部-装配工）';
            rightText = '16 类 122 件';
            break;
          default:
            break;
        }
        return <div key={index} className={styles.askNumberContent}>
          <div className={styles.askNumberContenLabel}>{leftText}</div>
          {rightText}
        </div>;
      })
    }

    <div className={styles.askNumberButtons}>
      {
        buttons.map((item, index) => {
          return <Button
            key={index}
            color={type === item.key ? 'primary' : 'default'}
            onClick={() => setType(item.key)}
          >
            <CaretUpFilled hidden={type !== item.key} className={styles.icon} />
            {item.title}
          </Button>;
        })
      }
    </div>
  </div>;
};

export default Ranking;
