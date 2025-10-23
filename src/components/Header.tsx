import React from "react";
import styled from "styled-components";

export const partnerColor = "#008363";
export const partnerColorAlpha = "#00836314";

export const Header = () => {
  return (
    <HeaderShell>
      <StyledHeader>Parafin Widget Quickstart</StyledHeader>
    </HeaderShell>
  );
};

const HeaderShell = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 20px;
  border-bottom: 1px solid ${partnerColorAlpha};
`;

const StyledHeader = styled.h1`
  color: ${partnerColor};
  background-color: transparent;
`;
