import React, { useEffect } from 'react';
import DemoList from '../demos';
export const MapView = ((props)=>{
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