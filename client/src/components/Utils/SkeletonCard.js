import React from "react";
import { Card, CardContent, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const SkeletonCard = () => {
  return (
    <>
      <Card>
        <Skeleton variant="rect" height={200} />
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
          <Divider style={{ margin: "1rem 0rem 1rem" }} />
          <Skeleton height={25} />
          <Skeleton height={25} width={1100} />
          <Skeleton height={25} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "75%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "50%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginTop: "1rem", opacity: "25%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
    </>
  );
};

export default SkeletonCard;
