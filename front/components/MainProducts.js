import React, { useCallback, useState } from 'react'
import Proptypes from 'prop-types';
import Router from 'next/router';
import { Card } from 'antd';

const MainProducts = ({product}) => {
    
    const [show, setShow] = useState(false);
    const onMouseHover = useCallback(
        () => {
            setShow(prev => !prev)
        },
        [],
    )
    const onClickCard = useCallback(
        (id) => () => {
            Router.push(`/product/${id}`)
        },
        [],
    )
    return (
        <Card
             onClick= {onClickCard(product.id,)}
             onMouseEnter = {onMouseHover}
             onMouseLeave = {onMouseHover}
             style={{ width: 240, cursor: 'pointer'}}
             cover={show ? <img alt="Images[1].src" src={product && product.Images[1].src} /> : <img alt="Images[0].src" src={product && product.Images[0].src} /> }
           >
             <div>
                 <span>{product && product.name}</span>
                 <strong>{product && product.price}</strong>
             </div>
           </Card>
    )
}
MainProducts.propTypes={
    product : Proptypes.shape({
        id: Proptypes.number,
        uniqueId: Proptypes.string,
        name: Proptypes.string,
        Reviews: Proptypes.arrayOf(Proptypes.object),
        Images: Proptypes.arrayOf(Proptypes.object),
        Likers : Proptypes.arrayOf(Proptypes.object),
        Stars: Proptypes.number,
        Colors: Proptypes.arrayOf(Proptypes.string),
        price: Proptypes.number,
        Size: Proptypes.string,
        Stock: Proptypes.number,
        inStock: Proptypes.bool,
        deliveryFee: Proptypes.number,
    }).isRequired,
}

export default MainProducts
