import { useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import AskAdd from '../../Work/PurchaseAsk/AskAdd';
import Errors from '../../Work/Instock/Errors';
import MyEmpty from '../../components/MyEmpty';
import { ReceiptsEnums } from '../index';
import InStockAsk from '../../Work/Instock/InstockAsk';
import OutStockAsk from '../../Work/OutStock/OutStockAsk';
import InventoryAsk from '../../Work/Inventory/InventoryAsk';
import { ERPEnums } from '../../Work/Stock/ERPEnums';


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
      return <InStockAsk type={judge ? ERPEnums.directInStock : ERPEnums.inStock} judge={judge} />;
    case ReceiptsEnums.outstockOrder:
      return <OutStockAsk />;
    case ReceiptsEnums.stocktaking:
      return <InventoryAsk />;
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
