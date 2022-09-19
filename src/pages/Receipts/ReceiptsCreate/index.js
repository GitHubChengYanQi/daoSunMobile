import { useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import AskAdd from '../../Work/PurchaseAsk/AskAdd';
import Errors from '../../Work/Instock/Errors';
import MyEmpty from '../../components/MyEmpty';
import { ReceiptsEnums } from '../index';
import { ERPEnums } from '../../Work/Stock/ERPEnums';
import SkuInstock from '../../Work/AddShop';


const ReceiptsCreate = () => {

  const location = useLocation();

  const query = location.query;
  const state = location.state;

  const [setType] = useState();

  const [moduleObject, setModuleObject] = useState({});

  const createRef = useRef();

  switch (query.type) {
    case ReceiptsEnums.instockOrder:
      const judge = { ...query }.hasOwnProperty('directInStock');
      return <SkuInstock type={judge ? ERPEnums.directInStock : ERPEnums.inStock} judge={judge} />;
    case ReceiptsEnums.outstockOrder:
      return <SkuInstock title='出库申请' type={ERPEnums.outStock} />;
    case ReceiptsEnums.stocktaking:
      return <SkuInstock title='盘点申请' type={ERPEnums.stocktaking} />;
    case ReceiptsEnums.allocation:
      return <SkuInstock title='调拨申请' type={ERPEnums.allocation} />;
    case 'purchaseAsk':
      return <AskAdd />;
    case ReceiptsEnums.error:
      return <Errors
        params={query.params}
        setModuleObject={setModuleObject}
        state={state}
        setType={setType}
        ref={createRef}
      />;
    default:
      return <MyEmpty />;
  }


};

export default ReceiptsCreate;
