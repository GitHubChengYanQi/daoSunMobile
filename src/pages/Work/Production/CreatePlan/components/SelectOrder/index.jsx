import React, { useEffect, useRef, useState } from 'react';
import styles from '../PlanDetail/index.less';
import MySearch from '../../../../../components/MySearch';
import MyList from '../../../../../components/MyList';
import { orderList } from '../../../../Order/Url';
import { CheckList } from 'antd-mobile';
import { isArray } from '../../../../../../util/ToolUtil';
import Label from '../../../../../components/Label';
import BottomButton from '../../../../../components/BottomButton';

const SelectOrder = (
  {
    visible,
    value = [],
    onChange = () => {
    },
    onClose = () => {
    },
  },
) => {

  const listRef = useRef();

  const [list, setList] = useState([]);

  const [searchValue, setSearchValue] = useState('');

  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    if (visible) {
      setCheckList(value);
    }
  }, [visible]);

  return <>
    <div className={styles.addOrder}>
      <MySearch onChange={setSearchValue} value={searchValue} onSearch={(value) => {
        listRef.current.submit({ coding: value, type: 2 });
      }} />
      <MyList ref={listRef} pullDisabled api={orderList} params={{ type: 2 }} getData={setList} data={list}>
        <CheckList
          value={checkList}
          multiple
          style={{
            '--font-size': '14px',
          }}
          onChange={(value) => {
            setCheckList(value);
          }}>
          {
            list.map((item, index) => {
              let numner = 0;
              isArray(item.detailResults).forEach(item => {
                numner += (item.purchaseNumber || 0)
              });
              return <CheckList.Item value={item} key={index}>
                <div>
                  <Label className={styles.label}>国家</Label>：无
                </div>
                <div>
                  <Label className={styles.label}>订单编号</Label>：{item.coding}
                </div>
                <div>
                  <Label className={styles.label}>产品数量</Label>：{numner}
                </div>
                <div>
                  <Label className={styles.label}>交货期</Label>：{item.leadTime || 0}天
                </div>
              </CheckList.Item>;
            })
          }
        </CheckList>
      </MyList>
    </div>
    <BottomButton
      leftText='取消'
      rightText='确认'
      leftOnClick={() => {
        onClose();
      }}
      rightOnClick={() => {
        onChange(checkList);
      }}
    />
  </>;
};

export default SelectOrder;
