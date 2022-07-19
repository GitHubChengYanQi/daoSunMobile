import React, { useState } from 'react';
import MyNavBar from '../components/MyNavBar';
import MyList from '../components/MyList';
import MyCard from '../components/MyCard';
import { useHistory } from 'react-router-dom';
import { ToolUtil } from '../components/ToolUtil';
import { RightOutline } from 'antd-mobile-icons';
import style from './index.less';
import { Avatar } from 'antd-mobile';

export const messageList = { url: '/message/list', method: 'POST' };

const Message = () => {

  const history = useHistory();

  const [data, setData] = useState([]);

  return <>
    <MyList data={data} getData={setData} api={messageList}>
      {
        data.map((item, index) => {
          return <div className={style.flexCenter} key={index}>
            <div className={style.box}>
              <div hidden={index > 1} className={style.badge} />
            </div>
            <div className={style.avatar}>
              <Avatar src='' style={{ '--border-radius': '50%' }} />
            </div>
            <MyCard
              className={style.card}
              bodyClassName={style.bodyStyle}
              titleBom={<div className={style.title}>{item.title}</div>}
              extra={<div className={ToolUtil.classNames(style.flexCenter, style.fontColor)}>
                {ToolUtil.timeDifference(item.time)}
                <RightOutline style={{ marginLeft: 8 }} />
              </div>}
              onClick={() => {
                switch (item.source) {
                  case 'instockOrder':
                  case 'instock':

                    break;
                  case 'outstockOrder':

                    break;
                  case 'productionTask':

                    break;
                  case 'selfPick':

                    break;
                  case 'processTask':
                    history.push(`Receipts/ReceiptsDetail?id=${item.sourceId}`);
                    break;
                  default:
                    break;
                }
              }}
              key={index}
            >
              <div
                className={ToolUtil.classNames(style.flexCenter, style.fontColor)}
              >
                {item.content}
              </div>
            </MyCard>
          </div>;
        })
      }
    </MyList>
  </>;
};

export default Message;
