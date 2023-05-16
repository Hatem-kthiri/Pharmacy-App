const adminMenu = [
  {
    text: "Pharmacy User",
    link: "/admin",
  },
  {
    text: "Provider User",
    link: "/admin/provider-user",
  },
  {
    text: "Orders",
    link: "/admin/orders",
  },
];
const pharmacyMenu = [
  {
    text: "My Stock",
    link: "/pharmacy",
  },
  {
    text: "Providers",
    link: "/pharmacy/provider",
  },
  {
    text: "Orders",
    link: "/pharmacy/my-orders",
  },
];
const providerMenu = [
  {
    text: "Products",
    link: "/provider",
  },
  {
    text: "Orders",
    link: "/provider/orders",
  },
];
export default {
  adminMenu,
  pharmacyMenu,
  providerMenu,
};
