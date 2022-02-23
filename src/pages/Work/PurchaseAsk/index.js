import React, { useRef } from 'react';
import MyPopup from '../../components/MyPopup';
import Screening from './components/Screening';
import AskList from './components/AskList';
import MyNavBar from '../../components/MyNavBar';
import MySearchBar from '../../components/MySearchBar';

const PurchaseAsk = () => {

  const ref = useRef();

  const listRef = useRef();

  return <>
    <MyNavBar title='采购申请' />
    <MySearchBar extra onExtra={() => {
      ref.current.open();
    }} />

    <div style={{height:'85vh',overflow:'auto'}}>
      <AskList ref={listRef} />
    </div>

    <MyPopup
      component={Screening}
      ref={ref}
      title='筛选'
      onSuccess={(value) => {
        listRef.current.submit(value);
        ref.current.close();
      }}
    />

  </>;
};

export default PurchaseAsk;
