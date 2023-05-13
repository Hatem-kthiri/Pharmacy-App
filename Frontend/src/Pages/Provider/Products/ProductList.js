import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import Dropzone from "react-dropzone";
import ProductH from "../../../Other/images/product/h.png";
import ProductLGB from "../../../Other/images/product/lg-b.jpg";
import ProductLGC from "../../../Other/images/product/lg-c.jpg";
import ProductLGD from "../../../Other/images/product/lg-d.jpg";
import ProductLGE from "../../../Other/images/product/lg-e.jpg";
import ProductLGF from "../../../Other/images/product/lg-f.jpg";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import {
  BlockHead,
  BlockDes,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Button,
  Block,
  Row,
  Col,
  PaginationComponent,
} from "../../../Other/components/Component";
import { useForm } from "react-hook-form";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Badge,
  FormGroup,
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import { productCardData } from "./ProductData";

const ProductList = () => {
  const getProviderProducts = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Replace 'YOUR_TOKEN' with the actual token value

      // Set the Authorization header with the token value
      const headers = {
        Authorization: token,
      };

      // Make a GET request to the backend endpoint
      const response = await axios.get("http://localhost:5000/api/provider/get-products", { headers });

      // Handle the response
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProviderProducts();
  }, []);

  const [data, setData] = useState(productCardData);

  const [smOption, setSmOption] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    productImage: "",
    description: "",
    quantity: 0,
    price: 0,
    manufacturer: "",
    expiryDate: "31-12-2023",
  });
  const [view, setView] = useState(false);
  const [filter, setFilter] = useState("");
  const [editView, setEditView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [editID, setEditID] = useState("");
  const [file, setFile] = useState();

  // Changing state value when searching name
  useEffect(() => {
    if (filter !== "") {
      const filteredObject = data.filter((item) => {
        return item.name.toLowerCase().includes(filter.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      getProviderProducts();
    }
  }, [filter, setData]);

  const toggle = () => {
    setView(!view);
    resetForm();
    console.log(formData);
  };
  const [defaultFiles, setDefaultFiles] = useState("");
  const resetForm = () => {
    setDefaultFiles("");
    setFormData({
      name: "",
      productImage: "",
      description: "",
      quantity: 0,
      price: 0,
      manufacturer: "",
      expiryDate: "",
    });
  };
  const onFormCancel = () => {
    setEditView(false);
    resetForm();
  };
  const onFormSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      // Make a POST request to the backend API
      await axios.post("http://localhost:5000/api/provider/add-product", formData, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      });
      getProviderProducts();
      reset();
      setView(false);
    } catch (error) {
      console.error(error);
    }
    // setView(false);
  };
  const onEditClick = async (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        setFormData({
          name: item.name,
          productImage: item.productImage,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          manufacturer: item.manufacturer,
          expiryDate: item.expiryDate,
        });
        setEditView(true);
        setEditID(id);
      }
    });
  };
  const onEditSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      // Make a POST request to the backend API
      await axios.put(`http://localhost:5000/api/provider/edit-product/${editID}`, formData, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      });
      getProviderProducts();
      setEditView(false);
    } catch (error) {
      console.error(error);
    }
  };
  const onDeleteClick = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      // Make a POST request to the backend API
      await axios.delete(`http://localhost:5000/api/provider/delete-product/${id}`, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      });
      getProviderProducts();
    } catch (error) {
      console.error(error);
    }
  };
  // filter text
  const onFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFile(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    // setFormData({ ...formData, productImage: acceptedFiles[0] });
  };
  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit, reset } = useForm();

  return (
    <React.Fragment>
      <Head title="Product List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Products</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setSmOption(!smOption);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
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
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>New Items</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Featured</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Out of Stock</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button className="toggle btn-icon d-md-none" color="primary" onClick={toggle}>
                        <Icon name="plus"></Icon>
                      </Button>
                      <Button className="toggle d-none d-md-inline-flex" color="primary" onClick={toggle}>
                        <Icon name="plus"></Icon>
                        <span>Add Product</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Row className="g-gs">
            {currentItems.length > 0 ? (
              currentItems &&
              currentItems.map((item) => {
                const dateValue = new Date(item.expiryDate);
                const day = dateValue.getDate();
                const month = dateValue.getMonth() + 1; // JavaScript months are zero-indexed
                const year = dateValue.getFullYear();

                const exDate = `${year}-${month}-${day}`;
                return (
                  <Col xxl={3} lg={4} sm={6} key={item.id}>
                    <Card className="card-bordered product-card">
                      <div className="product-thumb">
                        <Link to={`${process.env.PUBLIC_URL}/product-details/${item._id}`}>
                          <img className="card-img-top" src={item.productImage} alt="" />
                        </Link>
                        {/* <ul className="product-badges">
                          {item.new && (
                            <li>
                              <Badge color="success">New</Badge>
                            </li>
                          )}
                          {item.hot && (
                            <li>
                              <Badge color="danger">New</Badge>
                            </li>
                          )}
                        </ul> */}
                        <ul className="product-actions">
                          <li>
                            <a
                              onClick={() => {
                                onEditClick(item._id);
                              }}
                            >
                              <Icon name="edit"></Icon>
                            </a>
                          </li>
                          <li>
                            <a onClick={() => onDeleteClick(item._id)}>
                              <Icon name="delete"></Icon>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="card-inner text-center">
                        <ul className="product-tags">
                          <li>
                            <Link to={`${process.env.PUBLIC_URL}/product-details/${item.id}`}>{item.name}</Link>
                          </li>
                        </ul>
                        <h5 className="product-title">
                          <Link to={`${process.env.PUBLIC_URL}/product-details/${item.id}`}>{item.description}</Link>
                        </h5>
                        <div className="product-price text-primary h5">${item.price}</div>
                        <div className="product-price text-primary h5">{item.quantity}item</div>
                        <div className="product-price text-primary h5">{item.manufacturer}</div>
                        <div className="product-price text-primary h5">{exDate}</div>
                      </div>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <div className="ml-2">No product found</div>
            )}
          </Row>
          {currentItems.length > 0 && (
            <div className="mt-5">
              <PaginationComponent
                itemPerPage={itemPerPage}
                totalItems={data.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          )}
        </Block>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view ? "content-active" : ""}`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add Product</BlockTitle>
              <BlockDes>
                <p>Add new information for a product.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="product-title">
                      Product Name
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        // defaultValue={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Product Name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="sale-price">
                      Price
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        // dedfaultValue={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.price && <span className="invalid">{errors.price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Quantity
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="number"
                        name="quantity"
                        // defaultValue={formData.quantity}
                        placeholder="Quantity"
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.quantity && <span className="invalid">{errors.quantity.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Manufacturer
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        name="Manufacturer"
                        // defaultValue={formData.manufacturer}
                        placeholder="Manufacturer"
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.Manufacturer && <span className="invalid">{errors.Manufacturer.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label className="form-label" htmlFor="stock">
                      Expiry Date
                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="date"
                        name="expiryDate"
                        placeholder="expiryDate"
                        // Value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        ref={register({ required: "This field is required" })}
                        className="form-control"
                      />
                      {errors.expiryDate && <span className="invalid">{errors.expiryDate.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <FormGroup>
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      // defaultValue={formData.description}
                      placeholder="Your description"
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="form-control-xl form-control no-resize"
                      ref={register({
                        required: "This field is required",
                      })}
                    />
                    {errors.description && <span className="invalid">{errors.description.message}</span>}
                  </FormGroup>
                </Col>
                {/* <Col size="12">
                  <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles, setFile)} maxFiles={1}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className="dropzone upload-zone dz-clickable">
                          <input
                            {...getInputProps()}
                            onChange={(e) => setFormData({ ...formData, productImage: e.target.files[0] })}
                          />
                          {file.length === 0 && (
                            <div className="dz-message">
                              <span className="dz-message-text">Drag and drop file</span>
                              <span className="dz-message-or">or</span>
                              <Button color="primary">SELECT</Button>
                            </div>
                          )}
                          {file.map((file) => (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col> */}
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label">Product Image</label>
                    <div className="form-control-wrap">
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="customFile"
                          name="productImage"
                          onChange={(e) => {
                            setDefaultFiles(e.target.files[0].name);
                            setFormData({ ...formData, productImage: e.target.files[0] });
                          }}
                        />
                        <label className="custom-file-label" htmlFor="customFile">
                          {defaultFiles === "" ? "Choose files" : defaultFiles}
                        </label>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <Button color="primary">
                    <Icon className="plus" name="plus"></Icon>
                    <span>Add Product</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>
        {view && <div className="toggle-overlay" onClick={toggle}></div>}
        <Modal isOpen={editView} toggle={() => setEditView(false)} className="modal-dialog-centered" size="lg">
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
              <h5 className="title">Update Item</h5>
              <div className="mt-4">
                {/*  */}
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Product Name
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          name="name"
                          defaultValue={formData.name}
                          className="form-control"
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Product Name"
                          ref={register({ required: "This field is required" })}
                        />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </div>
                  </Col>

                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sale-price">
                        Price
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          name="price"
                          placeholder="Price"
                          defaultValue={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          ref={register({ required: "This field is required" })}
                          className="form-control"
                        />
                        {errors.price && <span className="invalid">{errors.price.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="stock">
                        Quantity
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                          defaultValue={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          ref={register({ required: "This field is required" })}
                          className="form-control"
                        />
                        {errors.quantity && <span className="invalid">{errors.quantity.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="stock">
                        Manufacturer
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          name="Manufacturer"
                          placeholder="Manufacturer"
                          defaultValue={formData.manufacturer}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                          ref={register({ required: "This field is required" })}
                          className="form-control"
                        />
                        {errors.Manufacturer && <span className="invalid">{errors.Manufacturer.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="stock">
                        Expiry Date
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="date"
                          name="expiryDate"
                          placeholder="expiryDate"
                          defaultValue={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                          // ref={register({ required: "This field is required" })}
                          className="form-control"
                        />
                        {errors.expiryDate && <span className="invalid">{errors.expiryDate.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col size="12">
                    <FormGroup>
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        defaultValue={formData.description}
                        placeholder="Your description"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="form-control-xl form-control no-resize"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.description && <span className="invalid">{errors.description.message}</span>}
                    </FormGroup>
                  </Col>
                  {/* <Col size="12">
                  <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles, setFile)} maxFiles={1}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()} className="dropzone upload-zone dz-clickable">
                          <input
                            {...getInputProps()}
                            onChange={(e) => setFormData({ ...formData, productImage: e.target.files[0] })}
                          />
                          {file.length === 0 && (
                            <div className="dz-message">
                              <span className="dz-message-text">Drag and drop file</span>
                              <span className="dz-message-or">or</span>
                              <Button color="primary">SELECT</Button>
                            </div>
                          )}
                          {file.map((file) => (
                            <div
                              key={file.name}
                              className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                            >
                              <div className="dz-image">
                                <img src={file.preview} alt="preview" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Col> */}
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label">Product Image</label>
                      <div className="form-control-wrap">
                        <div className="custom-file">
                          <input
                            type="file"
                            className="custom-file-input"
                            id="customFile"
                            name="productImage"
                            onChange={(e) => {
                              setDefaultFiles(e.target.files[0].name);
                              setFormData({ ...formData, productImage: e.target.files[0] });
                            }}
                          />
                          <label className="custom-file-label" htmlFor="customFile">
                            {defaultFiles === "" ? "Choose files" : defaultFiles}
                          </label>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col size="12">
                    <Button color="primary">
                      <span>Update Product</span>
                    </Button>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default ProductList;
