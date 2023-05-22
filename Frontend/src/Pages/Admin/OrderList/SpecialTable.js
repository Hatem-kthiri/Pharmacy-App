import React, { useEffect, useState } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  Form,
  Col,
  FormGroup,
  Card,
} from "reactstrap";
import { Button, Icon, RSelect } from "../../../Other/components/Component";
import { useForm } from "react-hook-form";
import axios from "axios";
export const SpecialTable = ({ action, isCompact }) => {
  const [data, setData] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [editId, setEditId] = useState();
  const [formData, setFormData] = useState({
    deliveryDate: Date.now(),
    delivredStatus: "Pending",
  });
  const getOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = {
        Authorization: token,
      };

      const response = await axios.get("http://localhost:5000/api/orders/get-orders", { headers });

      // Handle the response
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const [defaultSelect, setDefaultSelect] = useState({ value: "Pending", label: "Pending" });
  const onFormCancel = () => {
    setModalEdit(false);
    setModalInfo(false);
    reset();
  };
  const onEditClick = async (orderId) => {
    setModalEdit(true);
    setEditId(orderId);
    data.map((order) => {
      if (order._id == orderId) {
        const dateValue = new Date(order.deliveryDate);
        const day = dateValue.getDate();
        if (month < 10) {
          var month = `0${dateValue.getMonth() + 1}`;
        } else {
          var month = `0${dateValue.getMonth() + 1}`;
        }
        const year = dateValue.getFullYear();

        const exDate = `${year}-${month}-${day}`;
        setFormData({
          ...formData,
          deliveryDate: exDate,
        });
        setDefaultSelect({ value: order.delivredStatus, label: order.delivredStatus });
      }
    });
  };

  const onEditSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(`http://localhost:5000/api/orders/update-order/${editId}`, formData, {
        headers: { authorization: token },
      });
      getOrders();
      reset();
      setModalEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const displayPharmacyInfo = (id) => {
    setModalInfo(true);
    data.map((order) => {
      if (order.pharmacy._id == id) {
        setUserInfo({
          _id: order.pharmacy._id,
          name: order.pharmacy.name,
          location: order.pharmacy.location,
          email: order.pharmacy.email,
          phone: order.pharmacy.phone,
        });
      }
    });
  };
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
  const deleteOrder = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:5000/api/orders/remove-order/${id}`, {
        headers: { authorization: token },
      });
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };
  const { errors, register, handleSubmit, reset } = useForm();

  const filterData = data.filter((el) => el.product !== null && el.provider !== null && el.pharmacy !== null);
  const DropdownTrans = ({ orderId }) => {
    return (
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
          <Icon name="more-h"></Icon>
        </DropdownToggle>
        <DropdownMenu right>
          <ul className="link-list-plain">
            {/* <li>
              <DropdownItem
                tag="a"
                href="#dropdownitem"
                onClick={() => {
                  onEditClick(orderId);
                }}
              >
                Edit
              </DropdownItem>
            </li> */}
            <li>
              <DropdownItem
                tag="a"
                href="#dropdownitem"
                onClick={(ev) => {
                  ev.preventDefault();
                  deleteOrder(orderId);
                }}
              >
                Delete
              </DropdownItem>
            </li>
          </ul>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
  return (
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
              <span className="tb-tnx-total">Parmacy Details</span>
            </th>
            <th className="tb-tnx-amount is-alt">
              <span className="tb-tnx-total">Provider Details</span>
            </th>
            <th className="tb-tnx-amount ">
              <span className="">Delivery Date</span>
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
          {filterData &&
            filterData.map((item) => {
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
                      <span className="amount">{item.product.price * item.quantity} TND</span>
                    </div>
                  </td>
                  <td className="tb-tnx-amount is-alt">
                    <div className="tb-tnx-total">
                      <a href="#" onClick={() => displayPharmacyInfo(item.pharmacy._id)}>
                        <span className="amount">{item.pharmacy.name}</span>
                      </a>
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
                    <div className=" ">
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

                  {action && (
                    <td className="tb-tnx-action">
                      <DropdownTrans orderId={item._id} />
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {/* <Modal isOpen={modalEdit} toggle={() => setModalEdit(false)} className="modal-dialog-centered" size="lg">
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
               
              <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Delevery Date
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="date"
                        name="deliveryDate"
                        defaultValue={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        // ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.deleveryDate && <span className="invalid">{errors.deleveryDate.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label className="form-label" htmlFor="birth-day">
                      Language
                    </label>
                    <RSelect
                      options={[
                        {
                          value: "Delivered",
                          label: "Delivered",
                        },
                        {
                          value: "Pending",
                          label: "Pending",
                        },
                        {
                          value: "Cancelled",
                          label: "Cancelled",
                        },
                      ]}
                      defaultValue={defaultSelect}
                      onChange={(e) => setFormData({ ...formData, delivredStatus: e.value })}
                    />
                  </FormGroup>
                </Col>

                <Col size="12">
                  <Button color="primary">
                    <span>Update Order</span>
                  </Button>
                </Col>
              </Form>
            </div>
          </div>
        </ModalBody>
      </Modal> */}
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
            <h5 className="title">Order information</h5>
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
  );
};
