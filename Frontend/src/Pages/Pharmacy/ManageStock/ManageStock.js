import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
  Row,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../../Other/components/Component";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
const ManageStock = () => {
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const token = localStorage.getItem("accessToken");

  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [defaultFiles, setDefaultFiles] = useState("");

  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    productImage: "",
    description: "",
    quantity: 0,
    price: 0,
    expiryDate: "31-12-2025",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");

  // onChange to Set Values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = data.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      getPharmacyProducts();
    }
  }, [onSearchText, setData]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      productImage: "",
      description: "",
      quantity: 0,
      price: 0,
      expiryDate: "31-12-2025",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    reset();
  };
  //function to get Pharmacy user
  const getPharmacyProducts = () => {
    axios
      .get("http://localhost:5000/api/pharmacy/get-products", {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getPharmacyProducts();
  }, []);

  // submit function to add a new item
  const onFormSubmit = async () => {
    try {
      // Make a POST request to the backend API
      await axios.post("http://localhost:5000/api/pharmacy/add-product", formData, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      });
      getPharmacyProducts();
      reset();
      setModal({ edit: false, add: false });
    } catch (error) {
      console.error(error);
    }
    // setView(false);
  };

  // submit function to update a new item
  const onEditSubmit = () => {
    axios
      .put(`http://localhost:5000/api/pharmacy/edit-product/${editId}`, formData, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      })
      .then((res) => getPharmacyProducts())
      .catch((err) => console.log(err));
    setModal({ edit: false });
    resetForm();
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      const dateValue = new Date(item.expiryDate);
      const day = dateValue.getDate();
      if (month > 10) {
        var month = `${dateValue.getMonth() + 1}`;
      } else {
        var month = `0${dateValue.getMonth() + 1}`;
      }
      const year = dateValue.getFullYear();

      const exDate = `${year}-${month}-${day}`;
      if (item._id === id) {
        setFormData({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          expiryDate: exDate,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // function to change to suspend property for an item
  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:5000/api/pharmacy/delete-product/${id}`, {
        headers: { authorization: token, "Content-Type": "multipart/form-data" },
      })
      .then((res) => getPharmacyProducts())
      .catch((err) => console.log(err));
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit, reset } = useForm();

  return (
    <React.Fragment>
      <Head title="Pharmacy Stock"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Pharmacy Stock
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} item.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="" onClick={() => setModal({ add: true })}>
                        <Icon name="plus"></Icon>
                        <span>Add Item</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3"></div>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>

                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle color="tranparent" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow>
                  <span className="sub-text">Item image</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Name</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">quantity</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">price </span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">expiry Date</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Settings</span>
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    const dateValue = new Date(item.expiryDate);
                    const day = dateValue.getDate();
                    if (month < 10) {
                      var month = `0${dateValue.getMonth() + 1}`;
                    } else {
                      var month = `0${dateValue.getMonth() + 1}`;
                    }
                    const year = dateValue.getFullYear();

                    const exDate = `${year}-${month}-${day}`;
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                            <div className="user-card">
                              <img src={item.productImage} alt="product image " className="user-avatar" />
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="tb-amount">
                            <span>{item.name}</span>
                          </span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.quantity} Item</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <ul className="list-status">
                            <li>
                              <span>{item.price} TND</span>
                            </li>
                            <li></li>
                          </ul>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{exDate}</span>
                        </DataTableRow>

                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1" style={{ justifyContent: "flex-start" }}>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li onClick={() => onEditClick(item._id)}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li>
                                    {item.status !== "Suspend" && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => deleteProduct(item._id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Delete Product</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add Product</h5>
              <div className="mt-4">
                <Form className="row gy-4" noValidate onSubmit={handleSubmit(onFormSubmit)}>
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
                          Expiry Date
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="date"
                            name="expiryDate"
                            placeholder="expiryDate"
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            // ref={register({ required: "This field is required" })}
                            className="form-control"
                          />
                          {errors.expiryDate && <span className="invalid">{errors.expiryDate.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col md="6">
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
                      <FormGroup>
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
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

                    <Col size="12">
                      <Button color="primary">
                        <Icon className="plus" name="plus"></Icon>
                        <span>Add Product</span>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={modal.edit}
          toggle={() => setModal({ add: false, edit: false })}
          className="modal-dialog-centered"
          size="lg"
        >
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
              <h5 className="title">Update Product</h5>
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
                          defaultValue={formData.price}
                          placeholder="Price"
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

export default ManageStock;
