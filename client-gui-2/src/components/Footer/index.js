import React from "react";
import styled from "styled-components";
const FooterCustom = styled.div`
  width: 100%;
  height: 5rem;
  background-color: black;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  h5 {
    color: white;
    margin: 0.1rem;
    font-weight: 400;
    text-transform: none;
    line-height: 1.25;
    margin-bottom: 0px;
  }

  span {
    color: #ab7a5f;
  }
`;
const Footer = () => {
  return (
    <FooterCustom>
      <h5>© 2021</h5>
      <span>ComfySloth</span>
      <h5>All right reserved</h5>
    </FooterCustom>
  );
};

export default Footer;
