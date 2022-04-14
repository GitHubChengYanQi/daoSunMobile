import React from 'react';
import MyNavBar from '../../../../components/MyNavBar';
import MySearchBar from '../../../../components/MySearchBar';

const AssociatedTasks = (props) => {

  const params = props.location.query;

  return <>
    <div>
      <MyNavBar title='关联任务' />
      <MySearchBar extra />
    </div>
  </>;
};

export default AssociatedTasks;
