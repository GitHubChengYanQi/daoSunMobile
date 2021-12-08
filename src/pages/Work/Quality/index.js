import React from 'react';
import { useRequest } from '../../../util/Request';
import MyEmpty from '../../components/MyEmpty';
import Subtasks from './Subtasks';
import MainTask from './MainTask';
import { useDebounceEffect } from 'ahooks';

const Quality = (props) => {

  const query = props.location.query;

  // 质检任务详情的实物
  const { data, run } = useRequest({
    url: '/qualityTask/detail',
    method: 'POST',
  }, {
    manual: true,
  });

  useDebounceEffect(() => {
    if (query.id) {
      run({
        data: {
          qualityTaskId: query.id,
        },
      });
    }
  }, [props], {
    wait: 0,
  });

  if (!data) {
    return <MyEmpty />;
  }

  return data.parentId ? <Subtasks id={data.qualityTaskId} /> : <MainTask id={data.qualityTaskId} />;


};

export default Quality;
