import React, { useState } from 'react';
import { getPaginationParam } from 'antd/es/table/hooks/usePagination';
import { Steps } from 'antd';
import { useParams } from 'react-router-dom';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import EngineerRepair from '@/pages/Repair/EngineerRepair';
import Engineer from '@/pages/Repair/Engineer';
import EngineerImp from '@/pages/Repair/EngineerImp';
import CompletePage from '@/pages/Repair/CompletePage';
import EvaluationPage from '@/pages/Repair/EvaluationPage';
import { Icon, NavBar } from 'antd-mobile';
import { router } from 'umi';
const { Step } = Steps;

const items = [
  {'title': '新报修', content: <EngineerRepair />},
  {'title': '已派单', content: <Engineer />},
  {'title': '实施中', content: <EngineerImp />},
  {'title': '待评价', content: <CompletePage />},
  {'title': '完成', content: <EvaluationPage />},
]

const RepairList = () =>{

  let params =  window.location.href.split('?')[1];
  if(params === '5'){
    params = 4
  }
  const [state, setState] = useState(parseInt(params));

  const onChange = current => {
    setState(current );
  };
  return(
    <>
      <Steps size="small" labelPlacement="vertical" style={{padding: 10, overflow: 'auto'}} current={state} onChange={onChange}
      >
        {items.map(item => (
          <Step key={item.title} subTitle={item.title} disabled/>
        ))}

      </Steps>
      <div className="steps-content">{items[state].content}</div>
    </>

  );
};

export default RepairList;
