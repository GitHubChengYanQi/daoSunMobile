import { useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import AskAdd from '../../Work/PurchaseAsk/AskAdd';
import Errors from '../../Work/Instock/Errors';
import MyEmpty from '../../components/MyEmpty';
import MyBottom from '../../components/MyBottom';
import { CreateInstock, CreateInstockBottom } from '../components/Instock';
import Process from '../../Work/PurchaseAsk/components/Process';
import { ReceiptsEnums } from '../index';


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
        return <CreateInstock
          setModuleObject={setModuleObject}
          query={query}
          createRef={createRef}
          setType={setType}
        />;
      case 'purchaseAsk':
        return <AskAdd />;
      case ReceiptsEnums.instockError:
        return <Errors params={query.params} state={state} setType={setType} />;
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
      case 'purchaseAsk':
        return <></>;
      default:
        return <></>;
    }
  };


  return <>
    <MyBottom
      leftActuions={createModuleButtom(true)}
      buttons={createModuleButtom()}
    >
      {createModule(query.type)}
      <Process type={type} card />
    </MyBottom>
  </>;


};

export default ReceiptsCreate;
