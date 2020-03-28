import React from "react";
import { List, Card, CardContent } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const SkeletonList = () => {
  return (
    <>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "75%" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "50%" }}>
        <CardContent>
          <Skeleton height={40} />
          <Skeleton height={30} width={300} />
        </CardContent>
      </Card>
      <Card style={{ marginBottom: "1rem", opacity: "25%" }}>
        <CardContent>
          <Skeleton height={20} />
        </CardContent>
      </Card>
    </>
  );
};

export default SkeletonList;
