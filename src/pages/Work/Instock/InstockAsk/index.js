import React, { useRef, useState } from 'react';
import MyNavBar from '../../../components/MyNavBar';
import MySearch from '../../../components/MySearch';
import style from './index.less';
import { ScanningOutline } from 'antd-mobile-icons';
import SkuInstock from './coponents/SkuInstock';

const InstockAsk = () => {

  const [searchValue, setSearchValue] = useState();

  const ref = useRef();

  return <div className={style.instockAsk}>
    <MyNavBar title='入库申请' />
    <div className={style.content}>
      <div className={style.search}>
        <MySearch
          value={searchValue}
          searchIcon={<ScanningOutline />}
          placeholder={`请输入相关物料信息`}
          onChange={setSearchValue}
          onSearch={(value) => {
            if (!ref.current) {
              return;
            }
            ref.current.submit({ skuName: value });
          }}
          onClear={() => {
            ref.current.submit({ skuName: '' });
          }}
        />
      </div>
      <SkuInstock ref={ref} searchValue={searchValue} />
    </div>
  </div>;

};

export default InstockAsk;
