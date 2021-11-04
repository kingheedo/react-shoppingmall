import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
const AppLayout = ({children}) => {
    return (
        <div>
            <div>
            <Link href="/"><a>StarClothes</a></Link>
            <Link href="/signup"><a>SIGN UP</a></Link>
            <Link href="/signin"><a>SIGN IN</a></Link>
            <Link href="/cart"><a>장바구니</a></Link>
        </div>
        {children}
        </div>
    )
}

AppLayout.propTypes={
    children: PropTypes.node.isRequired
}

export default AppLayout
