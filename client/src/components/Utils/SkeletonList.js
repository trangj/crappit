import React from "react";
import { Skeleton } from "@chakra-ui/react";

const SkeletonList = () => {
	return (
		<>
			<Skeleton height={300} mt="2" />
			<Skeleton height={100} mt="2" />
			<Skeleton height={100} mt="2" />
			<Skeleton height={100} mt="2" style={{ opacity: "75%" }} />
			<Skeleton height={100} mt="2" style={{ opacity: "50%" }} />
			<Skeleton height={100} mt="2" style={{ opacity: "25%" }} />
		</>
	);
};

export default SkeletonList;
