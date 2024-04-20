import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';

const Breadcrumb = styled.div`
  max-width: 1440px;
  min-width: 1280px;
  margin: 0 auto;
  padding: 20px var(--gap) 0px;
`;

const BreadcrumbOl = styled.ol`
  display: flex;
`;
const BreadcrumbLi = styled.li`
  margin-right: 8px;
  font-size: var(--fontB);
  line-height: var(--fontBL);
  color: #111;
`;

const BreadcrumbLiLink = styled(Link)`
  background: url('/chevron-right.svg') no-repeat right center/12px auto;
  padding-right: 20px;
  color: var(--gray450);
`;

interface IBreadCrumbProps {
  list : {
    content: string;
    href?: string | UrlObject;
  }[]
}

const BreadCrumb = ({
  list,
}: IBreadCrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbOl>
        <BreadcrumbLi>
          <BreadcrumbLiLink href="/">Home</BreadcrumbLiLink>
        </BreadcrumbLi>
        {list.map((item) => (
          item.href
            ? (
              <BreadcrumbLi key={item.content}>
                <BreadcrumbLiLink href={item.href}>{item.content}</BreadcrumbLiLink>
              </BreadcrumbLi>
            )
          
            : (
              <BreadcrumbLi key={item.content}>
                {item.content}
              </BreadcrumbLi>
            )
          
        ))}
      </BreadcrumbOl>
    </Breadcrumb>
  );
};

export default BreadCrumb;