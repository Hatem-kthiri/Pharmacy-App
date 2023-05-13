import React from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { Block, BlockHead, BlockHeadContent, BlockTitle } from "../../../Other/components/Component";
import { Card } from "reactstrap";
import { SpecialTable } from "./SpecialTable";

const Orders = () => {
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
            <SpecialTable action={true} />
          </Card>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default Orders;
