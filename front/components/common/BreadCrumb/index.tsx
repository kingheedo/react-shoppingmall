import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const Breadcrumb = styled.div`
  padding: 20px var(--gap) 0px;
`;

const BreadcrumbOl = styled.ol`
  display: flex;
`;
const BreadcrumbLi = styled.li`
  margin-right: 8px;
  font-size: var(--fontB);
  line-height: var(--fontBL);
`;

const HomeLink = styled(Link)`
  background: url('/chevron-right.svg') no-repeat right center/12px auto;
  padding-right: 20px;
  color: var(--gray450);
`;

const BreadCrumb = ({ children }: PropsWithChildren) => {
  return (
    <Breadcrumb>
      <BreadcrumbOl>
        <BreadcrumbLi>
          <HomeLink href="/">Home</HomeLink>
        </BreadcrumbLi>
        <BreadcrumbLi>
          {children}
        </BreadcrumbLi>
      </BreadcrumbOl>
    </Breadcrumb>
  );
};

export default BreadCrumb;