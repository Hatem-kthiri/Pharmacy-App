import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Block, BlockHead, BlockHeadContent, BlockTitle, Icon, RSelect } from "../../../Other/components/Component";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  UncontrolledDropdown,
} from "reactstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

const Orders = () => {
  const token = localStorage.getItem("accessToken");

  const [data, setData] = useState([]);
  const isCompact = false;
  const action = true;
  const [modalEdit, setModalEdit] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [editId, setEditId] = useState();
  const [formData, setFormData] = useState({
    delivredStatus: "",
  });
  const getOrders = async () => {
    await axios
      .get("http://localhost:5000/api/orders/get-order-pharmacy", {
        headers: { authorization: token },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOrders();
  }, []);
  const displayProviderInfo = (id) => {
    setModalInfo(true);
    data.map((info) => {
      if (info.provider._id == id) {
        setUserInfo({
          name: info.provider.name,
          location: info.provider.location,
          email: info.provider.email,
          phone: info.provider.phone,
        });
      }
    });
  };
  const defaultSelect = { value: "Delivered", label: "Delivered" };
  const onFormCancel = () => {
    setModalEdit(false);
    setModalInfo(false);
    reset();
  };
  const onEditSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios
        .put(`http://localhost:5000/api/orders/update-order/${editId}`, formData, {
          headers: { authorization: token },
        })
        .then((res) => getOrders())
        .catch((err) => console.log(err));

      reset();
      setModalEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { errors, register, handleSubmit, reset } = useForm();
  const DropdownTrans = ({ itemId }) => {
    return (
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
          <Icon name="more-h"></Icon>
        </DropdownToggle>
        <DropdownMenu right>
          <ul className="link-list-plain">
            <li>
              <DropdownItem
                tag="a"
                href="#dropdownitem"
                onClick={() => {
                  setModalEdit(true);
                  setEditId(itemId);
                }}
              >
                Edit
              </DropdownItem>
            </li>
            {/* <li>
              <DropdownItem
                tag="a"
                href="#dropdownitem"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                Delete
              </DropdownItem>
            </li> */}
          </ul>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
  return (
    <React.Fragment>
      <Head title="Order List" />
      <Content page="component">
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Order List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <Card className="card-bordered card-preview">
            <>
              <table className={`table table-tranx ${isCompact ? "is-compact" : ""}`}>
                <thead>
                  <tr className="tb-tnx-head">
                    <th>
                      <span>
                        <span>Product</span>
                      </span>
                    </th>
                    <th className="tb-tnx-info">
                      <span className="d-none d-md-block">
                        <span>Quantity</span>
                      </span>
                    </th>
                    <th className="tb-tnx-info">
                      <span className="d-none d-md-block">
                        <span>Price</span>
                      </span>
                    </th>
                    <th className="tb-tnx-amount is-alt">
                      <span className="tb-tnx-total">Provider Details</span>
                    </th>
                    <th className="tb-tnx-amount is-alt">
                      <span className="tb-tnx-total">Delivery Date</span>
                    </th>
                    <th className="tb-tnx-amount is-alt">
                      <span className=" d-none d-md-inline-block">Status</span>
                    </th>
                    {action && (
                      <th className="tb-tnx-action">
                        <span>&nbsp;</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item) => {
                      const dateValue = new Date(item.deliveryDate);
                      const day = dateValue.getDate();
                      if (month < 10) {
                        var month = `0${dateValue.getMonth() + 1}`;
                      } else {
                        var month = `0${dateValue.getMonth() + 1}`;
                      }
                      const year = dateValue.getFullYear();

                      const exDate = `${year}-${month}-${day}`;
                      return (
                        <tr key={item.id} className="tb-tnx-item">
                          {/* <td className="tb-tnx-id">
                    <a
                      href="#id"
                      onClick={(ev) => {
                        ev.preventDefault();
                      }}
                    >
                      <span>{item.id}</span>
                    </a>
                  </td> */}
                          <td className="tb-tnx-info">
                            <div className="tb-tnx-desc" style={{ overflow: "visible" }}>
                              <span className="title">{item.product.name}</span>
                            </div>
                          </td>
                          <td className="tb-tnx-amount is-alt">
                            <div className="tb-tnx-desc" style={{ overflow: "visible" }}>
                              <span className="title">{item.quantity} item</span>
                            </div>
                          </td>
                          <td className="tb-tnx-amount is-alt">
                            <div className="tb-tnx-total">
                              <span className="amount"> {item.product.price * item.quantity} TND</span>
                            </div>
                          </td>
                          <td className="tb-tnx-amount is-alt">
                            <div className="tb-tnx-total">
                              <a href="#" onClick={() => displayProviderInfo(item.provider._id)}>
                                <span className="amount">{item.provider.name}</span>
                              </a>
                            </div>
                          </td>
                          <td className="tb-tnx-amount is-alt">
                            <div className="tb-tnx-total">
                              <span className="amount">{exDate}</span>
                            </div>
                          </td>
                          <td>
                            <div className="tb-tnx-status">
                              <span
                                className={`badge badge-dot badge-${
                                  item.delivredStatus === "Delivered"
                                    ? "success"
                                    : item.delivredStatus === "Pending"
                                    ? "warning"
                                    : "danger"
                                }`}
                              >
                                {item.delivredStatus}
                              </span>
                            </div>
                          </td>

                          {action && item.delivredStatus === "Delivered" && (
                            <td className="tb-tnx-action">
                              <DropdownTrans itemId={item._id} />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <Modal isOpen={modalEdit} toggle={() => setModalEdit(false)} className="modal-dialog-centered" size="lg">
                <ModalBody>
                  <a
                    href="#cancel"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onFormCancel();
                    }}
                    className="close"
                  >
                    <Icon name="cross-sm"></Icon>
                  </a>
                  <div className="p-2">
                    <h5 className="title">Update order</h5>
                    <div className="mt-4">
                      {/* */}
                      <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                        <Col md="12">
                          <FormGroup>
                            <label className="form-label" htmlFor="birth-day">
                              Status
                            </label>
                            <RSelect
                              options={[
                                {
                                  value: "Received",
                                  label: "Received",
                                },
                              ]}
                              defaultValue={defaultSelect}
                              onChange={(e) => setFormData({ ...formData, delivredStatus: e.value })}
                            />
                          </FormGroup>
                        </Col>

                        <Col size="12">
                          <Button color="primary">
                            <span>Close Order</span>
                          </Button>
                        </Col>
                      </Form>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
              <Modal isOpen={modalInfo} toggle={() => setModalInfo(false)} className="modal-dialog-centered" size="lg">
                <ModalBody>
                  <a
                    href="#cancel"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onFormCancel();
                    }}
                    className="close"
                  >
                    <Icon name="cross-sm"></Icon>
                  </a>
                  <div className="p-2">
                    <h5 className="title">Provider information</h5>
                    <Card className="card-bordered">
                      <div className="nk-data data-list">
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Full Name</span>
                            <span className="data-value">{userInfo.name}</span>
                          </div>
                        </div>
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Email</span>
                            <span className="data-value">{userInfo.email}</span>
                          </div>
                        </div>
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Location</span>
                            <span className="data-value">{userInfo.location}</span>
                          </div>
                        </div>
                        <div className="data-item">
                          <div className="data-col">
                            <span className="data-label">Phone Number</span>
                            <span className="data-value text-soft">{userInfo.phone}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ModalBody>
              </Modal>
            </>
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Orders;
