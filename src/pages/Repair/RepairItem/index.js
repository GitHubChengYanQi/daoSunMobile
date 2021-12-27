import { history } from 'umi';
import styles from './index.css';
import { Card } from 'antd-mobile';

const RepairItem = ({compnay,items,brand,address, type, id, progress,select}) => {
  const itemClick = ()=>{
    history.push(`/Repair/RepairList?id=${id}&select=${select}`);
  }
  let progressName;
  if(progress === 0) {
    progressName =  "报修中···";
  } else if(progress === 1){
    progressName =  "派单中···";
  } else if(progress === 2){
    progressName =  "实施中···";
  } else if(progress === 3){
    progressName =   "待完成···";
  } else if(progress === 4){
    progressName =   "待评价···";
  }else{
    progressName =   "已完成报修";
  }
  return(
    <>
     <Card
      className={styles.card}
      onClick={()=>{itemClick()}}
      extra={'详细信息 >>'}
      title={'报修进度：' + progressName}
    >
      <div className={styles.repairItem}>
        <div className={styles.repairContent}>
          <span className={styles.spuName}>客户公司：{compnay}</span>
          <span className={styles.spuName}>保修设备：{items}</span>
          <span className={styles.spuName}>品牌：{brand}</span>
          <span className={styles.spuName}>报修类型：{type} </span>
          <span className={styles.address}>地址：{address} </span>
        </div>
      </div>
    </Card>
    </>
  );
};
export default RepairItem;
