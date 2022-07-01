import React from 'react';
import { ToolUtil } from '../../../../../../components/ToolUtil';
import { Steps } from 'antd-mobile';
import style from '../../index.less';
import { DownOutline, UpOutline } from 'antd-mobile-icons';
import LinkButton from '../../../../../../components/LinkButton';
import { useModel } from 'umi';
import { Avatar } from 'antd';

const StepList = (
  {
    remarks = [],
    onChange = () => {
    },
    addComments = () => {
    },
  },
) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = initialState.userInfo || {};

  return <>
    <Steps
      direction='vertical'
      style={{
        '--indicator-margin-right': '12px',
      }}
    >
      {
        remarks.map((item, index) => {

          const permissions = userInfo.id === item.createUser;

          const replys = item.childrens || [];

          const user = ToolUtil.isObject(item.user);

          return <Steps.Step
            status='success'
            key={index}
            title={
              <div className={style.name}>
                <span hidden={!user.name}>{user.name}</span>
                <span>{item.createTime}</span>
              </div>
            }
            description={<div className={style.description}>
              <div className={style.content}>
                {item.content}
              </div>
              <div hidden={replys.length === 0} className={style.reply}>
                <div onClick={() => {
                  const newRemakes = remarks.map((item, currentIndex) => {
                    if (index === currentIndex) {
                      return { ...item, down: !item.down };
                    }
                    return item;
                  });
                  onChange(newRemakes);
                }}>{item.down ? <DownOutline /> : <UpOutline />} 回复
                </div>
                {
                  !item.down && replys.map((item, index) => {
                    return <div key={index} className={style.replyItem}>
                      <div className={style.name}>
                        {ToolUtil.isObject(item.user).name}
                        <span>{item.createTime}</span>
                      </div>
                      <div className={style.description}>
                        {item.content}
                      </div>
                    </div>;
                  })
                }
              </div>
              <div hidden={item.type !== 'comments'} className={style.actions}>
                <LinkButton onClick={() => {
                  addComments(item.remarksId);
                }}>回复</LinkButton>
                <LinkButton>置顶</LinkButton>
                {permissions && <LinkButton>编辑</LinkButton>}
                {permissions && <LinkButton color='danger'>删除</LinkButton>}
              </div>
            </div>}
            icon={<Avatar
              size={26}
              shape='square'
              key={index}
              src={user.avatar}
            >{user.name && user.name.substring(0, 1)}</Avatar>}
          />;
        })
      }

    </Steps>
  </>;
};

export default StepList;
