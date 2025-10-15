import React from "react";
import { Card, CardBody } from "reactstrap";

const PageBody = (props: any) => {
  const classes = props.className;
  const classesBody = props.classNameBody;
  return (
    <div
      className={`${classes ? classes : ""} page__container`}
      style={{ ...props?.style }}
    >
      <Card>
        <CardBody className={classesBody}>{props.children}</CardBody>
      </Card>
    </div>
  );
};

export default PageBody;
