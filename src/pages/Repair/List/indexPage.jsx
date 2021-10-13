// import React from 'react'
// import {View, Text, Image} from '@tarojs/components'
// import './index.scss'
// import Taro from "@tarojs/taro";
// import {AtCard} from "taro-ui";
//
// const repairItem = ({compnay,items,brand,address, type, id, progress}) => {
//   const itemClick = ()=>{
//     Taro.navigateTo({
//       url: `/pages/engineerOrder/index?id=${id}`
//     });
//   }
//   let progressName;
//   if(progress == 0) {
//     progressName =  "报修中";
//   } else if(progress == 1){
//     progressName =  "派单中";
//   } else if(progress == 2){
//     progressName =  "实施中";
//   } else if(progress == 3){
//     progressName =   "待完成";
//   } else if(progress == 4){
//     progressName =   "待评价";
//   }else{
//     progressName =   "已完成报修";
//   }
//   return(
//     <AtCard
//       onClick={()=>{itemClick()}}
//       note={'地址：' + address}
//       extra={'详细信息 >>'}
//       title={'报修进度：' + progressName}
//     >
//       <View className='repairItem'>
//         <View className='repairContent'>
//           <Text className='spuName'>客户公司：{compnay}</Text>
//           <Text className='spuName'>保修设备：{items}</Text>
//           <Text className='spuName'>品牌：{brand}</Text>
//           <Text className='spuName'>报修类型：{type} </Text>
//         </View>
//       </View>
//     </AtCard>  )
// }
// export default  repairItem;
