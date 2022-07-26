import React, { useImperativeHandle, useState } from 'react';
import style from './index.less';
import { useModel } from 'umi';
import { useLocation } from 'react-router-dom';
import Add from './components/Add';
import MyAntPopup from '../../../../../../../components/MyAntPopup';
import { ERPEnums } from '../../../../../../Stock/ERPEnums';
import AllocationAdd from './components/AllocationAdd';

const AddSku = (
  {
    onChange = () => {
    },
    type: defaultType,
    skus = [],
    onClose = () => {
    },
    defaultAction,
  }, ref) => {

  const [type, setType] = useState(defaultType);

  const { initialState } = useModel('@@initialState');
  const state = initialState || {};

  const { query } = useLocation();

  const [sku, setSku] = useState({});

  const [other, setOther] = useState({});

  const [visible, setVisible] = useState();

  const [data, setData] = useState({});

  const [oneAdd, setOneAdd] = useState();

  const openSkuAdd = async (sku = {}, initType, other = {}) => {
    const type = initType || defaultType;
    setType(type);
    setSku(sku);
    setOther(other);
    let newData = {};
    switch (type) {
      case ERPEnums.allocation:
        newData = { title: query.storeHouse + (query.askType === 'moveLibrary' ? '移库' : (query.allocationType === 'out' ? '调出' : '调入')) };
        setOneAdd(false);
        break;
      case ERPEnums.outStock:
        newData = { title: '出库任务' };
        setOneAdd(true);
        break;
      case ERPEnums.inStock:
      case ERPEnums.directInStock:
        newData = { title: '入库任务' };
        setOneAdd(true);
        break;
      default:
        break;
    }
    setData(newData);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    openSkuAdd,
  }));


  return <>

    <MyAntPopup
      title={data.title}
      onClose={() => {
        setVisible(false);
        onClose();
      }}
      destroyOnClose
      className={style.addSkuPopup}
      visible={visible}
    >
      {oneAdd ? <Add
        onChange={onChange}
        skus={skus}
        other={other}
        type={type}
        query={query}
        state={state}
        defaultAction={defaultAction}
        sku={sku}
        onClose={() => {
          setVisible(false);
          onClose();
        }}
      /> : <AllocationAdd
        query={query}
        sku={sku}
        onClose={() => {
          setVisible(false);
          onClose();
        }}
      />}
    </MyAntPopup>
  </>;
};

export default React.forwardRef(AddSku);
