import React, { useEffect, useState } from "react";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  PreviewAltCard,
  PreviewCard,
  Row,
  UserAvatar,
} from "../../../Other/components/Component";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "react-router-dom";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { findUpper } from "../../../utils/Utils";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const ProvidersShop = () => {
  const [data, setData] = useState([]);
  const [modalInfo, setModalInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [makeOrder, setMakeOrder] = useState(false);
  const [filter, setFilter] = useState("");

  function getDateAfterThreeDays() {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    return threeDaysLater;
  }

  const onFilterChange = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    if (filter !== "") {
      console.log(filter);
      const filteredObject = data.filter((item) => {
        return item.name.toLowerCase().includes(filter.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      getProducts();
    }
  }, [filter, setData]);

  const [formData, setFormData] = useState({
    product: "",
    provider: "",
    quantity: "",
    deliveryDate: getDateAfterThreeDays(),
  });
  const token = localStorage.getItem("accessToken");
  //function to get Pharmacy user
  const getProducts = () => {
    axios
      .get("http://localhost:5000/api/pharmacy/get-all-products", {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getProducts();
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
  const onFormCancel = () => {
    setModalInfo(false);
    reset();
  };
  const CloseButton = () => {
    return (
      <span className="btn-trigger toast-close-button" role="button">
        <Icon name="cross"></Icon>
      </span>
    );
  };
  const errorToast = (quantity) => {
    toast.error(`Max Quantity is ${quantity} item`, {
      position: "top-right",
      autoClose: true,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      closeButton: <CloseButton />,
    });
  };
  const successToast = () => {
    toast.success(`Order Submitted Successfully`, {
      position: "top-right",
      autoClose: true,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: false,
      closeButton: <CloseButton />,
    });
  };
  const sendOrder = async (product_id, provider_id, quantity) => {
    try {
      if (formData.quantity > quantity) {
        errorToast(quantity);
      } else {
        await axios.post(
          "http://localhost:5000/api/orders/create-order",
          { ...formData, provider: provider_id, product: product_id },
          {
            headers: { authorization: token },
          }
        );
        setMakeOrder("");
        successToast();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const { reset, errors, register } = useForm();

  return (
    <React.Fragment>
      <Head title="Providers Shop"></Head>
      <Content>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Providers Products</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <div className="form-control-wrap" style={{ marginBottom: "10px" }}>
              <div className="form-icon form-icon-right">
                <Icon name="search"></Icon>
              </div>
              <input
                type="text"
                className="form-control"
                id="default-04"
                onChange={onFilterChange}
                placeholder="Quick search by name"
              />
            </div>
            <Row>
              {data.map((item) => {
                return (
                  <Col md="6" lg="4">
                    <PreviewAltCard>
                      <div className="team" id={item._id}>
                        <div className="user-card user-card-s2">
                          <img src={item.productImage} alt="product image" className="user-avatar lg" />
                          <div className="user-info">
                            <h6>{item.name}</h6>
                          </div>
                        </div>
                        <div className="team-details">
                          <p>
                            Provider :{" "}
                            <a href="#" onClick={() => displayProviderInfo(item.provider._id)}>
                              {item.provider.name}
                            </a>
                          </p>
                        </div>
                        <ul className="team-info">
                          <li>
                            <span>Price</span>
                            <span>{item.price} TND</span>
                          </li>
                          <li>
                            <span>Manufacturer</span>
                            <span>{item.manufacturer}</span>
                          </li>
                          <li>
                            <span>Quantity</span>
                            <span>{item.quantity}</span>
                          </li>
                        </ul>
                        <div className="team-view">
                          {makeOrder === item._id ? (
                            <Col size="12">
                              <div className="form-group">
                                <label className="form-label" htmlFor="product-title">
                                  Quantity for order
                                </label>
                                <div className="form-control-wrap">
                                  <input
                                    type="number"
                                    name="quantity"
                                    className="form-control"
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="Quantity"
                                    ref={register({ required: "This field is required" })}
                                  />
                                  {errors.quantity && <span className="invalid">{errors.quantity.message}</span>}
                                </div>
                              </div>
                              <Button
                                color="primary"
                                className="btn-block btn-dim"
                                onClick={() => sendOrder(item._id, item.provider._id, item.quantity)}
                              >
                                <span>Send Order</span>
                              </Button>
                            </Col>
                          ) : (
                            <Button
                              color="primary"
                              className="btn-block btn-dim"
                              onClick={() => setMakeOrder(item._id)}
                            >
                              <span>Make Order</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </PreviewAltCard>
                  </Col>
                );
              })}
            </Row>
          </PreviewCard>{" "}
        </Block>
      </Content>
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
      <ToastContainer />
    </React.Fragment>
  );
};

export default ProvidersShop;
