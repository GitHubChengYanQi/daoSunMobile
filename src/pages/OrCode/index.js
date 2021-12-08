import wx from 'populee-weixin-js-sdk';
import {  useState } from 'react';
import {  useRequest } from '../../util/Request';
import { Loading } from 'antd-mobile';
import Spu from '../Scan/Spu';
import StoreHouse from '../Scan/StoreHouse';
import StoreHousePosition from '../Scan/StoreHousePosition';
import Stock from '../Report/components/Stock';
import InStock from '../Scan/InStock';
import OutStock from '../Scan/OutStock';
import { useDebounceEffect } from 'ahooks';

// https://dasheng-soft.picp.vip/#/OrCode?id=1453935045308170242

const OrCode = (props) => {

  const id = props.location.query.id

  const [type,setType] = useState(null);
  const [data,setData] = useState(null);

  const {refresh,run} = useRequest({url:'/orCode/backObject',method:'GET',},
    {
      manual:true,
      onSuccess:(res)=>{
        setType(res.type);
        setData(res.result);
      }
    });

  const getQrCode = async (id) =>{
    await run({
      params:{
        id,
      }
    });
  }

  const getScan = ()=>{
    wx.ready(() => {
      wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: (res) => {
          // 回调
          if (res.resultStr.indexOf('https') !== -1){
            const param = res.resultStr.split('=');
            if (param && param[1]){
              getQrCode(param[1]);
            }
          }else {
            getQrCode(res.resultStr);
          }

        },
        error: (res) => {
          alert(res);
          if (res.errMsg.indexOf('function_not_exist') > 0) {

          }
        },
      });
    });
  }

  useDebounceEffect(() => {
    if(id){
      getQrCode(id);
    }else {
      getScan();
    }
  }, [],{
    wait:0
  });

  switch (type) {
    case "spu":
      return <Spu data={data} />;
    case "storehouse":
      return <StoreHouse data={data} />;
    case "storehousePositions":
      return <StoreHousePosition />;
    case "stock":
      return <Stock />;
    case "instock":
      return <InStock data={data} onChange={()=>{
        refresh();
      }} />;
    case "outstock":
      return <OutStock data={data} onChange={()=>{
        refresh();
      }} />;
    default:
      return  <Loading />
  }
};

export default OrCode;
