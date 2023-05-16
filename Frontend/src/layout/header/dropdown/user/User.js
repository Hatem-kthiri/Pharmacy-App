import React, { useEffect, useState } from "react";
import UserAvatar from "../../../../Other/components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../Other/components/Component";
import { LinkList, LinkItem } from "../../../../Other/components/links/Links";
import { handleSignout } from "../../../../utils/Utils";
import axios from "axios";
const User = ({ role, name, email }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const token = localStorage.getItem("accessToken");
  const [userInfo, setUserInfo] = useState({
    name: "Loading ...",
    email: "Loading ...",
  });
  const getUserInfo = () => {
    axios
      .get("http://localhost:5000/api/users/", { headers: { authorization: token } })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-xl-block">
            <div
              className={`user-status ${
                window.location.pathname.split("/")[2] === "invest" ? "user-status-unverified" : ""
              }`}
            >
              {window.location.pathname.split("/")[2] === "invest" ? "Unverified" : ""}
            </div>
            <div className="user-name dropdown-indicator">{userInfo.name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>{userInfo.name[0].toUpperCase()}</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{userInfo.name}</span>
              <span className="sub-text">{userInfo.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          {role === "admin" ? null : (
            <LinkList>
              <LinkItem
                link={role === "pharmacy" ? "/pharmacy/profile" : role === "provider" ? "/provider/profile" : null}
                icon="user-alt"
                onClick={toggle}
              >
                View Profile
              </LinkItem>
            </LinkList>
          )}
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
