import React from "react";
import SectionMenu from "../../components/SectionMenu";
import styled from "styled-components";
import { Button } from "antd";
import { NavLink } from "react-router-dom";

const Content = styled.section`
  padding: 50px 0px;
  width: 95%;
  margin: 0 auto;
`;

const Item = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: start;
  border: 2px solid gray;
  border-radius: 7px;
  width: 80%;
  height: 300px;
`;
export default function MyCourses() {
  return (
    <div>
      <SectionMenu menuCurrent="My courses" />
      <Content>
        {[].map((cs, key) => {
          return (
            <Item key={key}>
              <img height="100%" src={cs?.thumbnail} alt="thumbnail" />
              <div style={{ padding: "10px 20px" }}>
                <h3>{cs?.course_name}</h3>
                <div style={{ fontSize: "20px", color: "gray" }}>
                  <p>
                    {cs.status} - {cs.end_date}
                  </p>
                </div>
                <NavLink to={`/courses/${cs.course_id}`}>
                  <Button type="primary">Course Detail</Button>
                </NavLink>
              </div>
            </Item>
          );
        })}
      </Content>
    </div>
  );
}
