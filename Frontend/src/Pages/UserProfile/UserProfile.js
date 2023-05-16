import React, { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import DatePicker from "react-datepicker";
import {
  Modal,
  ModalBody,
  FormGroup,
  Card,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Spinner,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
  UserAvatar,
  InputSwitch,
} from "../../Other/components/Component";
import { countryOptions, userData } from "../../Other/pages/pre-built/user-manage/UserData";
import { findUpper, getDateStructured } from "../../utils/Utils";
import Content from "../../layout/content/Content";
import { Link } from "react-router-dom";
import axios from "axios";
const UserProfile = ({ sm, updateSm }) => {
  const [Tab, setTab] = useState("1");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [formData, setFormData] = useState();
  const [modal, setModal] = useState(false);
  const token = localStorage.getItem("accessToken");
  const getUserInfo = () => {
    axios
      .get("http://localhost:5000/api/users/", { headers: { authorization: token } })
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitForm = () => {
    axios
      .put(`http://localhost:5000/api/users/${userInfo._id}`, formData)
      .then((res) => getUserInfo())
      .catch((err) => console.log(err));
    setModal(false);
  };

  return (
    <React.Fragment>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              {loading ? (
                <Spinner size="sm" color="light" />
              ) : (
                <div className="card-inner-group">
                  <div className="card-inner">
                    <div className="user-card">
                      <div class="user-avatar bg-primary">{userInfo.name[0].toUpperCase()}</div>
                      <div className="user-info">
                        <span className="lead-text">{userInfo.name}</span>
                        <span className="sub-text">{userInfo.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-inner p-0">
                    <ul className="link-list-menu">
                      <li>
                        <a href="#information" onClick={() => setTab("1")} className={Tab === "1" ? "active" : ""}>
                          <Icon name="user-fill-c"></Icon>
                          <span>Personal Information</span>
                        </a>
                      </li>

                      {/* <li>
                        <a href="#setting" onClick={() => setTab("2")} className={Tab === "2" ? "active" : ""}>
                          <Icon name="lock-alt-fill"></Icon>
                          <span>Security Setting</span>
                        </a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <React.Fragment>
                <Head title="User - Profile"></Head>
                <BlockHead size="lg">
                  <BlockBetween>
                    <BlockHeadContent>
                      <BlockTitle tag="h4">Personal Information</BlockTitle>
                    </BlockHeadContent>
                    <BlockHeadContent className="align-self-start d-lg-none">
                      <Button
                        className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                        onClick={() => updateSm(!sm)}
                      >
                        <Icon name="menu-alt-r"></Icon>
                      </Button>
                    </BlockHeadContent>
                  </BlockBetween>
                </BlockHead>
                {Tab === "1" ? (
                  <Block>
                    <div className="nk-data data-list">
                      <div className="data-head">
                        <h6 className="overline-title">Basics</h6>
                      </div>
                      <div className="data-item" onClick={() => setModal(true)}>
                        <div className="data-col">
                          <span className="data-label">Full Name</span>
                          <span className="data-value">{userInfo.name}</span>
                        </div>
                        <div className="data-col data-col-end">
                          <span className="data-more">
                            <Icon name="forward-ios"></Icon>
                          </span>
                        </div>
                      </div>

                      <div className="data-item">
                        <div className="data-col">
                          <span className="data-label">Email</span>
                          <span className="data-value">info@softnio.com</span>
                        </div>
                        <div className="data-col data-col-end">
                          <span className="data-more disable">
                            <Icon name="lock-alt"></Icon>
                          </span>
                        </div>
                      </div>
                      <div className="data-item" onClick={() => setModal(true)}>
                        <div className="data-col">
                          <span className="data-label">Phone Number</span>
                          <span className="data-value text-soft">{userInfo.phone}</span>
                        </div>
                        <div className="data-col data-col-end">
                          <span className="data-more">
                            <Icon name="forward-ios"></Icon>
                          </span>
                        </div>
                      </div>

                      <div className="data-item" onClick={() => setModal(true)}>
                        <div className="data-col">
                          <span className="data-label">Location</span>
                          <span className="data-value">{userInfo.location}</span>
                        </div>
                        <div className="data-col data-col-end">
                          <span className="data-more">
                            <Icon name="forward-ios"></Icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Block>
                ) : //   <Block>
                //     <Card className="card-bordered">
                //       <div className="card-inner-group">
                //         <div className="card-inner">
                //           <div className="between-center flex-wrap flex-md-nowrap g-3">
                //             <div className="nk-block-text">
                //               <h6>Save my Activity Logs</h6>
                //               <p>You can save your all activity logs including unusual activity detected.</p>
                //             </div>
                //             <div className="nk-block-actions">
                //               <ul className="align-center gx-3">
                //                 <li className="order-md-last">
                //                   <div className="custom-control custom-switch mr-n2">
                //                     <InputSwitch checked id="activity-log" />
                //                   </div>
                //                 </li>
                //               </ul>
                //             </div>
                //           </div>
                //         </div>
                //         <div className="card-inner">
                //           <div className="between-center flex-wrap g-3">
                //             <div className="nk-block-text">
                //               <h6>Change Password</h6>
                //               <p>Set a unique password to protect your account.</p>
                //             </div>
                //             <div className="nk-block-actions flex-shrink-sm-0">
                //               <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                //                 <li className="order-md-last">
                //                   <Button color="primary">Change Password</Button>
                //                 </li>
                //                 <li>
                //                   <em className="text-soft text-date fs-12px">
                //                     Last changed: <span>Oct 2, 2019</span>
                //                   </em>
                //                 </li>
                //               </ul>
                //             </div>
                //           </div>
                //         </div>
                //         <div className="card-body">
                //           <div className="between-center flex-wrap flex-md-nowrap g-3">
                //             <div className="nk-block-text">
                //               <h6>
                //                 2 Factor Auth &nbsp; <span className="badge badge-success ml-0">Enabled</span>
                //               </h6>
                //               <p>
                //                 Secure your account with 2FA security. When it is activated you will need to enter not
                //                 only your password, but also a special code using app. You will receive this code via
                //                 mobile application.{" "}
                //               </p>
                //             </div>
                //             <div className="nk-block-actions">
                //               <Button color="primary">Disable</Button>
                //             </div>
                //           </div>
                //         </div>
                //       </div>
                //     </Card>
                //   </Block>
                null}
                <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
                  <ModalBody>
                    <a
                      href="#dropdownitem"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setModal(false);
                      }}
                      className="close"
                    >
                      <Icon name="cross-sm"></Icon>
                    </a>
                    <div className="p-2">
                      <h5 className="title">Update Profile</h5>

                      <div className="tab-content">
                        <div id="personal">
                          <Row className="gy-4">
                            <Col md="6">
                              <FormGroup>
                                <label className="form-label" htmlFor="full-name">
                                  Full Name
                                </label>
                                <input
                                  type="text"
                                  id="full-name"
                                  className="form-control"
                                  name="name"
                                  onChange={(e) => onInputChange(e)}
                                  defaultValue={userInfo.name}
                                  placeholder="Enter Full name"
                                />
                              </FormGroup>
                            </Col>

                            <Col md="6">
                              <FormGroup>
                                <label className="form-label" htmlFor="phone-no">
                                  Phone Number
                                </label>
                                <input
                                  type="number"
                                  id="phone-no"
                                  className="form-control"
                                  name="phone"
                                  onChange={(e) => onInputChange(e)}
                                  defaultValue={userInfo.phone}
                                  placeholder="Phone Number"
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6">
                              <FormGroup>
                                <label className="form-label" htmlFor="address-l1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  id="address-l1"
                                  name="location"
                                  onChange={(e) => onInputChange(e)}
                                  defaultValue={userInfo.location}
                                  className="form-control"
                                />
                              </FormGroup>
                            </Col>

                            <Col size="12">
                              <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                                <li>
                                  <Button
                                    color="primary"
                                    size="lg"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      submitForm();
                                    }}
                                  >
                                    Update Profile
                                  </Button>
                                </li>
                                <li>
                                  <a
                                    href="#dropdownitem"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      setModal(false);
                                    }}
                                    className="link link-light"
                                  >
                                    Cancel
                                  </a>
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
              </React.Fragment>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};
export default UserProfile;
