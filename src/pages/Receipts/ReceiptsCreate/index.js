import { useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import AskAdd from '../../Work/PurchaseAsk/AskAdd';
import Errors from '../../Work/Instock/Errors';
import MyEmpty from '../../components/MyEmpty';
import MyBottom from '../../components/MyBottom';
import { CreateInstock, CreateInstockBottom, InstockError } from '../components/Instock';
import Process from '../../Work/PurchaseAsk/components/Process';
import { ReceiptsEnums } from '../index';
import InStockAsk from '../../Work/Instock/InstockAsk';
import OutStockAsk from '../../Work/OutStock/OutStockAsk';


const ReceiptsCreate = () => {

  const location = useLocation();

  const query = location.query;
  const state = location.state;

  const [type, setType] = useState();

  const [moduleObject, setModuleObject] = useState({});

  const createRef = useRef();

  const createModule = (value) => {
    switch (value) {
      case ReceiptsEnums.instockOrder:
        return <InStockAsk />;
      case ReceiptsEnums.outstockOrder:
        return <OutStockAsk />;
      case 'purchaseAsk':
        return <AskAdd />;
      case ReceiptsEnums.instockError:
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

  const createModuleButtom = (left) => {
    switch (query.type) {
      case ReceiptsEnums.instockOrder:
        return <CreateInstockBottom
          createRef={createRef}
          left={left}
          moduleObject={moduleObject}
        />;
      case ReceiptsEnums.instockError:
        return <InstockError
          createRef={createRef}
          left={left}
          moduleObject={moduleObject}
        />;
      case 'purchaseAsk':
        return <></>;
      default:
        return <></>;
    }
  };


  switch (query.type) {
    case ReceiptsEnums.instockOrder:
      return <InStockAsk />;
    case ReceiptsEnums.outstockOrder:
      return <OutStockAsk />;
    case 'purchaseAsk':
      return <AskAdd />;
    case ReceiptsEnums.instockError:
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
