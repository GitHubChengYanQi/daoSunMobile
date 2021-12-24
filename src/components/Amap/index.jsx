import React, {useRef, useState} from 'react';
import {Map} from 'react-amap';
import AmapSearch from './search';
import LinkButton from '../../pages/components/LinkButton';
import { Popup } from 'antd-mobile';

const Amap = ({title, value, onClose, onChange}) => {
  const [visible, setVisible] = useState(false);
  const [center,setCenter] = useState({});

  const mapRef = useRef(null);

  const events = {
    dragend: () => {
      mapRef.current.setCenter(true);
    },
    dragging: (v) => {
      mapRef.current.setCenter(false);
    }
  };

  return (
    <>
      <LinkButton
        onClick={()=>{
          setVisible(true);
        }}
        title={<>{value && value.address || (title || '定位') }</>} />
      <Popup
        visible={visible}
        bodyStyle={{ minHeight: '100vh' }}
      >
        <div style={{height: '100vh'}}>
          <Map events={events} amapkey={''} center={center} version={'2.0'} zoom={16}>
            <AmapSearch ref={mapRef} center={(value)=>{
              setCenter({longitude: value.lgn, latitude: value.lat});
            }} onChange={(value) => {
              setVisible(false);
              typeof onChange === 'function' && onChange(value);
            }} />
          </Map>
        </div>
      </Popup>
    </>

  );
};
export default Amap;
