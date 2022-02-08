import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Marker } from 'react-amap';
import { Button,  Cascader as AntCascader, Input } from 'antd';
import { useRequest } from '../../util/Request';
import LinkButton from '../../pages/components/LinkButton';
import { Ellipsis, List, Popover } from 'antd-mobile';

let MSearch = null;
let Geocoder = null;

const AmapSearch = ({ __ele__, __map__, onChange, center }, ref) => {


  const [citys, setCitys] = useState();

  const [city, setCity] = useState();

  const [visiable, setVisiable] = useState();


  const { run } = useRequest({ url: '/commonArea/treeView', method: 'POST' }, { manual: true });
  const { run: runCisy } = useRequest({ url: '/commonArea/list', method: 'POST' }, { manual: true });


  // console.log(window.AMap);
  window.AMap.plugin(['AMap.PlaceSearch'], function() {
    const PlaceSearchOptions = { // 设置PlaceSearch属性
      city: city && city.city, // 城市
      type: '', // 数据类别
      pageSize: 10, // 每页结果数,默认10
      pageIndex: 1, // 请求页码，默认1
      extensions: 'all', // 返回信息详略，默认为base（基本信息）
    };
    MSearch = new window.AMap.PlaceSearch(PlaceSearchOptions); // 构造PlaceSearch类
    window.AMap.Event.addListener(MSearch, 'complete', (result) => {
      setResult(result.poiList);
    }); // 返回结果
  });
  window.AMap.plugin(['AMap.Geocoder'], function() {
    Geocoder = new window.AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: '',
    });
  });

  // const MSearch = new __map__.PlaceSearch();
  // console.log(MSearch);
  const [adinfo, setadinfo] = useState({});
  const [reslut, setResult] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const setData = (value) => {
    setMarkerPosition(value.location);
    __map__.setCenter(value.location);
  };

  useImperativeHandle(ref, () => ({
    setCenter: (is) => {
      const value = __map__.getCenter();
      setMarkerPosition(value);
      if (is) {
        const lnglat = [value.lng, value.lat];
        Geocoder.getAddress(lnglat, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            const m = {
              address: result.regeocode.formattedAddress,
              name: '',
              location: [value.lng, value.lat],
              city: result.regeocode.addressComponent.city || result.regeocode.addressComponent.province,
            };
            setadinfo(m);
          }
        });
      }
    },
  }));


  useEffect(() => {
    window.AMap.plugin('AMap.CitySearch', function() {
      const citySearch = new window.AMap.CitySearch();
      citySearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          Geocoder.getLocation(result.city, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              setadinfo({
                address: result.geocodes[0].formattedAddress,
                location: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
                city: result.geocodes[0].addressComponent.city || result.geocodes[0].addressComponent.province,
              });
              center(
                {
                  lat: result.geocodes[0].location.lat,
                  lgn: result.geocodes[0].location.lng,
                },
              );
              setMarkerPosition({
                lat: result.geocodes[0].location.lat,
                lng: result.geocodes[0].location.lng,
              });
              // result中对应详细地理坐标信息
            }
          });
          // 查询成功，result即为当前所在城市信息
          setCity(result);
        }
      });
    });
    // const value = __map__.getCenter();
    run({}).then((res) => {
      setCitys(res);
    });

  }, []);

  return (
    <div
      style={{ position: 'absolute', top: 0, padding: 8, width: '100%' }}
    >
      <div style={{ width: '37%', margin: '0 5px', display: 'inline-block' }}>
        {city &&
        <AntCascader
          changeOnSelect
          showSearch={(inputValue, path) => {
            path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
          }}
          options={citys}
          defaultValue={[city.city]}
          onChange={async (value) => {
            let cityId = null;
            value.length > 0 && value.map((items, index) => {
              return cityId = items;
            });
            const city = await runCisy({
              data: {
                id: cityId,
              },
            });
            Geocoder.getLocation(city.length > 0 && city[0].title, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                setadinfo({
                  address: result.geocodes[0].formattedAddress,
                  location: [result.geocodes[0].location.lng, result.geocodes[0].location.lat],
                  city: result.geocodes[0].addressComponent.city || result.geocodes[0].addressComponent.province,
                });
                center(
                  {
                    lat: result.geocodes[0].location.lat,
                    lgn: result.geocodes[0].location.lng,
                  },
                );
                setMarkerPosition({
                  lat: result.geocodes[0].location.lat,
                  lng: result.geocodes[0].location.lng,
                });
                // result中对应详细地理坐标信息
              }
            });
          }} />}</div>
      <div style={{ width: '37%', margin: '0 5px', display: 'inline-block' }}>
        <Popover
          content={
            reslut && reslut.count > 0 &&
            <div style={{ maxHeight: '50vh', width: '100%', overflowY: 'auto', marginTop: 16 }}>
              <List style={{ width: '100%' }}>
                {reslut.pois.map((item, index) => {
                  return (<List.Item
                    style={{ mixWidth: '100%' }}
                    key={index}
                    title={<Ellipsis content={item.name} />}
                    description={<Ellipsis content={item.type} />}
                    onClick={() => {
                      setData(item);
                    }}
                    extra={<LinkButton title='使用该地址' onClick={() => {
                      const location = {
                        address: item.pname + item.cityname + item.address,
                        location: [item.location.lng, item.location.lat],
                        city: item.cityname || item.pname,
                      };
                      typeof onChange === 'function' && onChange(location);
                      setVisiable(false);
                    }} />}>
                    <div style={{minWidth:'50vw'}}>
                      <Ellipsis content={item.address} />
                    </div>
                  </List.Item>);
                })}
              </List>
            </div>
          }
          placement={'bottom'}
          trigger='click'
          onVisibleChange={(visible) => {
            setVisiable(visible);
          }}
          visible={visiable}
        >
          <Input
            style={{ width: '100%' }}
            placeholder='搜索地址'
            onChange={(value) => {
              MSearch.search(value.target.value);
              setVisiable(true);
            }}
          />
        </Popover>
      </div>
      <Button
        type='primary'
        onClick={() => {
          typeof onChange === 'function' && onChange(adinfo);
        }}>确定</Button>
      {markerPosition && <Marker position={markerPosition} __map__={__map__} />}
    </div>
  );

};

export default React.forwardRef(AmapSearch);
