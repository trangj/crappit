import React from "react";
import { Card, CardContent, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const SkeletonCard = () => {
  return (
    <>
      <Card>
        <Skeleton variant="rect" height={175} />
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
          <Divider style={{ margin: "1rem 0rem 1rem" }} />
          <Skeleton variant="rect" height={100} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "75%" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "50%" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "25%" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
    </>
  );
};

export default SkeletonCard;
