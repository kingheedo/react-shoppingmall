import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
const LinkItem = styled(Link)`
    display: inline-block;
    line-height: 58px;
    font-size: 17px;
    margin: 0 4px;
    min-width: 256px;
    padding: 0 69px;
    height: 60px;
    color: #fff;
    background: #111;
    border: 1px solid #111;
`;

interface ILinkBtnProps {
  href: string;
  content: string;
}

const LinkBtn = ({ href,content }: ILinkBtnProps) => {
  return (
    <LinkItem href={href}>
      {content}
    </LinkItem>
  );
};

export default LinkBtn;