// import React, {useEffect, useState} from 'react'
// import Taro, {useDidShow} from "@tarojs/taro";
// import {View} from "@tarojs/components";
// import Auth from "../../components/Auth";
// import IndexPage from "./indexPage";
// import useRequest from "../../utils/useRequest";
// import Skeleton from 'taro-skeleton'
// import 'taro-skeleton/dist/index.css'
// import NonePage from "../../components/nonepage";
// import {useReachBottom} from "@tarojs/runtime";
// import {AtActivityIndicator} from "taro-ui";
//
// let pages = 1;
// let oldPages = 1;
// let content = [];
// const limits = 5
//
// const AllRepair = () => {
//
//   const [repairAll, setRepair] = useState([]);
//   const [all, setAll] = useState(true);
//   const [show,setShow] = useState();
//
//   const {loading,run: runGetRepairAll} = useRequest({
//     url: '/api/getRepairAll',
//     method: "POST",
//   }, {
//     onSuccess:(res)=>{
//       if (res && res.errCode === 0 && res.data && res.data.data.length > 0) {
//         res.data.data.map((items, index) => {
//           content.push(items);
//         })
//         setShow(false);
//       }else {
//         setShow(false);
//         setAll(false);
//       }
//       setRepair(content);
//     }
//   })
//
//   const page = (page) => {
//     runGetRepairAll({params: {page: page, limit: limits}})
//   }
//
//   useReachBottom(() => {
//     oldPages = pages;
//     setShow(true);
//     if (all){
//       page(++pages);
//     }else {
//       setTimeout(()=>{
//         setShow(false)
//         Taro.showToast({
//           title:"没有更多数据啦~亲~",
//           icon:"none"
//         });
//       },1000);
//     }
//   })
//
//   useEffect(() => {
//     content = [];
//     pages = 1;
//     page(pages);
//   }, [])
//
//   return (
//     <View>
//       <Skeleton
//         title
//         row={5}
//         loading={pages === 1 && loading}
//       >
//         <View>
//           {
//             repairAll.length > 0 ? repairAll.map((item, index) => {
//               return (
//                 <IndexPage
//                   key={index}
//                   compnay={item.customerResult && item.customerResult.customerName}
//                   items={item.deliveryDetailsResult && item.deliveryDetailsResult.detailesItems && item.deliveryDetailsResult.detailesItems.name}
//                   brand={item.deliveryDetailsResult && item.deliveryDetailsResult.detailsBrand && item.deliveryDetailsResult.detailsBrand.brandName}
//                   address={item.regionResult[0] ? item.regionResult[0].province + "-" + item.regionResult[0].city + "-" + item.regionResult[0].area + "-" + item.address : null}
//                   type={item.serviceType}
//                   id={item.repairId}
//                   progress={item.progress}
//                 />
//               )
//             }) : <View className='position'><NonePage title='暂无数据' /></View>
//           }
//         </View>
//         <View className='state'>
//           {show ? <AtActivityIndicator color='#13CE66' className='load'></AtActivityIndicator> : null}
//           {!show && repairAll.length > 0 && !all && '已经到底了~'  }
//         </View>
//
//       </Skeleton>
//     </View>
//   )
// }
// export default AllRepair;
