import React, { useEffect, useRef } from 'react'
import SectionMenu from '../../components/SectionMenu'
import styled from 'styled-components';
import { Form, Input } from 'antd';
import { createStructuredSelector } from 'reselect'
import {
  getUserInfoStart,
  updateUserInfoStart
}
  from './actions'
import {
  makeSelectUser
}
  from './selectors';
import { useDispatch, useSelector } from 'react-redux'
import { useInjectReducer, useInjectSaga } from '../../redux/reduxInjectors'
import reducer from './reducer'
import saga from './saga'
const key = "profileRoot"

const stateStructor = createStructuredSelector({
  user: makeSelectUser()
})

const Container = styled.section`
  padding: 50px 0px;
  width: 95%;
  margin: 0 auto;
`
const TextField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
export default function Profile() {
  const dispatch = useDispatch();
  useInjectReducer(key, reducer);
  useInjectSaga(key, saga);
  const formRef = useRef();

  const {
    user
  } = useSelector(stateStructor)
  const [form] = Form.useForm();
 
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const newToken = localStorage.getItem('token')
      dispatch(getUserInfoStart(newToken));
    }
  }, [dispatch])

  useEffect(() => {
    if (user.length !== 0) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address
      });
    }
  }, [user, dispatch])

  function handleKeyUp(event) {
    if (event.keyCode === 13) {
      formRef.current.submit();
      const data = {
        user_id: user.id,
        first_name: form.getFieldValue(['first_name']),
        last_name: form.getFieldValue(['last_name']),
        email: form.getFieldValue(['email']),
        phone_number: form.getFieldValue(['phone_number']),
        address: form.getFieldValue(['address'])
      }
      dispatch(updateUserInfoStart(data));
    }
  }

  return (
    <div>
      <SectionMenu menuCurrent="Profile" />
      <Container>
        <h4>Basic account information</h4>
        <p>Set up basic information about your account..</p>
        <Form
          ref={formRef}
          form={form}
          onKeyUp={handleKeyUp}
          layout="horizontal"
        >
          <div className='mt-4 row'>
            <div className='col-4'>
              <TextField>
                <h6>First Name</h6>
                <Form.Item name="first_name" rules={[{ required: true }]}>
                  <Input placeholder="First Name"/>
                </Form.Item>
              </TextField>
            </div>
            <div className='col-8'>
              <p>The name used for ID verification and appears on your certificate.</p>
            </div>
          </div>
          <div className='mt-4 row'>
            <div className='col-4'>
              <TextField>
                <h6>Last Name</h6>
                <Form.Item name="last_name" rules={[{ required: true }]}>
                  <Input placeholder="Last Name" />
                </Form.Item>
              </TextField>
            </div>
            <div className='col-8'>
              <p>The name used for ID verification and appears on your certificate.</p>
            </div>
          </div>
          <div className='mt-4 row'>
            <div className='col-4'>
              <TextField>
                <h6>Email</h6>
                <Form.Item name="email" rules={[{ required: true }]}>
                  <Input placeholder="Email" />
                </Form.Item>
              </TextField>
            </div>
            <div className='col-8'>
              <p>You received a message at this address..</p>
            </div>
          </div>

          <div className='mt-4 row'>
            <div className='col-4'>
              <TextField>
                <h6>Phone number</h6>
                <Form.Item name="phone_number" rules={[{ required: true }]}>
                  <Input placeholder="Phone number" />
                </Form.Item>
              </TextField>
            </div>
            <div className='col-8'>
              <p>You received a call at this number..</p>
            </div>
          </div>

          <div className='mt-4 row'>
            <div className='col-4'>
              <TextField>
                <h6>Address</h6>
                <Form.Item name="address" rules={[{ required: true }]}>
                  <Input placeholder="Address" />
                </Form.Item>
              </TextField>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  )
}
