import React, { useState } from 'react';
import { useRequest } from '../../../../../util/Request';
import { isArray } from '../../../../components/ToolUtil';
import { outStockDetailView } from '../../../components/Ranking';
import styles from '../../index.less';
import MyCheck from '../../../../components/MyCheck';
import { DownOutline, RightOutline } from 'antd-mobile-icons';

const OutAsk = (
  {},
) => {

  const [list, setList] = useState([]);

  const {
    loading: outStockDetailViewLoading,
    run: outStockDetailViewrRun,
  } = useRequest({ ...outStockDetailView, data: {} }, {
    onSuccess: (res) => {
      setList(isArray(res).sort((a, b) => (b.outNumCount || b.orderCount || 0) - (a.outNumCount || a.orderCount || 0)));
    },
  });

  const [open, setOpen] = useState(false);

  return [1,2,3,4].map((item, index) => {
    return <div key={index} className={styles.listItem}>
      <div className={styles.header}>
        <MyCheck fontSize={17} />
        <div className={styles.label}>{item.userResult?.name || '无申请人'}</div>
        <div>共申请 <span className='numberBlue'>3</span>次</div>
        {open ? <DownOutline /> : <RightOutline />}
      </div>
      <div className={styles.space} />
    </div>;
  });
};

export default OutAsk;
