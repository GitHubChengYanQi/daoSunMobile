import React, { useEffect, useRef, useState } from 'react';
import Comments from '../../../components/Comments';
import { Steps } from 'antd-mobile';
import style from './index.less';
import { ToolUtil } from '../../../../components/ToolUtil';
import { DownOutline, FileOutline, UpOutline } from 'antd-mobile-icons';
import Icon from '../../../../components/Icon';
import LinkButton from '../../../../components/LinkButton';
import { useModel } from 'umi';

const Log = (
  {
    data = {},
    refresh = () => {
    },
  },
) => {

  const { initialState } = useModel('@@initialState');
  const userInfo = initialState.userInfo || {};


  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    setRemarks(data.remarks || []);
  }, [data.remarks]);

  const ref = useRef();

  const icon = (type, status) => {
    switch (type) {
      case 'audit':
        return <Icon
          type={status ? 'icon-caigou_shenpitongguo1' : 'icon-caigou_shenpibutongguo1'}
          style={{ fontSize: 29 }}
        />;
      case 'comments':
        return <FileOutline style={{ fontSize: 29, color: 'var(--adm-color-primary)' }} />;
      default:
        return <></>;
    }
  };

  return <div className={style.log}>
    <Comments detail={data} id={data.processTaskId} title='添加评论' refresh={refresh} ref={ref} />
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

          return <Steps.Step
            status='wait'
            key={index}
            title={
              <div className={style.name}>
                <div>{ToolUtil.isObject(item.user).name}</div>
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
                  setRemarks(newRemakes);
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
                  ref.current.addComments(item.remarksId);
                }}>回复</LinkButton>
                <LinkButton>置顶</LinkButton>
                {permissions && <LinkButton>编辑</LinkButton>}
                {permissions && <LinkButton color='danger'>删除</LinkButton>}
              </div>
            </div>}
            icon={icon(item.type, item.status)}
          />;
        })
      }

    </Steps>

  </div>;
};

export default Log;
