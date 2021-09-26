import { Card } from 'antd';
import Text from 'antd/es/typography/Text';
import { router } from 'umi';
import styles from './index.css';
import { Icon, NavBar } from 'antd-mobile';

const RepairItem = ({compnay,items,brand,address, type, id, progress}) => {
  const itemClick = ()=>{
    router.push(`/Repair/RepairList?${progress}`);
  }
  let progressName;
  if(progress == 0) {
    progressName =  "报修中···";
  } else if(progress == 1){
    progressName =  "派单中···";
  } else if(progress == 2){
    progressName =  "实施中···";
  } else if(progress == 3){
    progressName =   "待完成···";
  } else if(progress == 4){
    progressName =   "待评价···";
  }else{
    progressName =   "已完成报修";
  }
  return(
    <>
     <Card
      className={styles.card}
      bordered
      onClick={()=>{itemClick()}}
      extra={'详细信息 >>'}
      title={'报修进度：' + progressName}
    >
      <div className={styles.repairItem}>
        <div className={styles.repairContent}>
          <Text className={styles.spuName}>客户公司：{compnay}</Text>
          <Text className={styles.spuName}>保修设备：{items}</Text>
          <Text className={styles.spuName}>品牌：{brand}</Text>
          <Text className={styles.spuName}>报修类型：{type} </Text>
          <Text className={styles.address}>地址：{address} </Text>
        </div>
      </div>
    </Card>
    </>
  );
};
export default RepairItem;
