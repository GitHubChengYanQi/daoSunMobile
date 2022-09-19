import React from 'react';
import { useLocation } from 'react-router-dom';
import MyCard from '../../../components/MyCard';
import jrQrcode from 'jr-qrcode';
import MyNavBar from '../../../components/MyNavBar';
import LinkButton from '../../../components/LinkButton';
import PrintCode from '../../../components/PrintCode';
import MyEmpty from '../../../components/MyEmpty';

const InkindList = () => {

  const { query } = useLocation();

  const inkindIds = query.inkindIds ? query.inkindIds.split(',') : [];

  if (inkindIds.length === 0){
    return <MyEmpty description='暂无实物数据' />
  }

  return <>
    <MyNavBar title='二维码列表' />
    {
      inkindIds.map((item, index) => {
        return <MyCard
          title={item}
          key={index}
          extra={<LinkButton onClick={() => {
            PrintCode.print([`<img src='${jrQrcode.getQrBase64(item)}' alt='' />`], 0);
          }}>打印二维码</LinkButton>}
        >
          <div style={{ textAlign: 'center' }}>
            <img height={200} src={jrQrcode.getQrBase64(item)} alt='' />
          </div>
        </MyCard>;
      })
    }
  </>;
};

export default InkindList;
