import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const SkeletonList = () => {
  return (
    <>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "75%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "50%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "25%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "25%" }}>
        <CardContent>
          <Skeleton height={25} />
          <Skeleton height={20} width={300} />
        </CardContent>
      </Card>
    </>
  );
};

export default SkeletonList;
