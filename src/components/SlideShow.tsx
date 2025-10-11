import AspectRatio from './AspectRatio/AspectRatio';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import styled from 'styled-components';

interface Props {
  data: any,
  ratio?: any,
  speed?: number
}
const SlideShow = (props:Props) => {
  const {data,ratio, speed } = props
  const [index, setIndex] = useState(0)
  useEffect(() => {
   
  }, [])
  const settings = {

    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: speed ? speed : 4000,
    cssEase: "linear"
};
  const Item = (props:any)=>{ 
    const {item} = props;
    return (
        <AspectRatio ratio={ratio || 1}>
          <img alt="banner" src={item} style={{width:'100%', height:`100%`, objectFit: 'cover'}}/>
        </AspectRatio>
    )
  }
  const _onChage = (index:any)=>{
    setIndex(index)
  }
    return (
      <div style={{position:'relative', width:'100%', height:'100%'}} >
        <Slider {...settings}
         afterChange={_onChage}
        >
          {
            data.map((item:any, index: number)=>{
              return <Item key={index}  item={item}/>
            })
          }
          
        </Slider>
        {
          data.length > 1 && <Count>{`${(index+1)}/${data.length}`}</Count>
        }
        
      </div>
    );

}

const Count = styled.div`
    position: absolute;
    bottom: 30px;
    right: 16px;
    padding: 4px 10px;
    border-radius: 11px;
    background:rgba(34, 34, 34, 0.5);
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
`
const PanigationList = styled.div`
  height: 10px;
  background: red;
  display: flex;
  align-items: center;
`

export default SlideShow;