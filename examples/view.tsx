// @ts-ignore
import React, { useEffect,useState } from 'react';
import DemoList from './demos';
import { Cascader } from 'antd';
import 'antd/dist/antd.css';

const MapView = ((props)=>{
    const { data = ['Point','PointFill'] } = props; // 通过解构赋值获取传递的 data 参数
    useEffect(()=>{
        const group = DemoList.find(d=>d.name === data[0]);
        group?.demos[data[1]]();
        return ()=>{
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.innerHTML = '';
            }
        }
    },[data]);

  return <div id="map" style={{ width: '100%',height:'100%' }}/>
});

export default () => {
    const [values,setValue] = useState()
    const CascaderOption = DemoList.map((group) => {
        return {
            label: group.name,
            value: group.name,
            children: Object.keys(group.demos).map((key) => {
                return {
                    label: key,
                    value: key,
                    demo: group.demos[key]
                }

            })
        }
    })

    const onChange = (e) => {
      history.pushState({ value:e }, '', `?type=${e[0]}&name=${e[1]}`);
      setValue(e)
    }
  
 

    return (<>
        <div style={{ position: 'absolute', left:'20px', zIndex:10, top: '20px' }} >
            <Cascader defaultValue={['Point', 'PointFill']} options={CascaderOption} onChange={onChange} />
        </div>
         < MapView data={values}/>
    </>
    );
};
