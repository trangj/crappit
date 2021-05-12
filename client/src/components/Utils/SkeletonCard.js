import React from "react";
import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

const SkeletonBox = () => {
	return (
		<>
			<Skeleton height={300} />
			<SkeletonText noOfLines={5} />

			<Skeleton height={100} mt="5" />
			<Skeleton height={100} mt="5" />
			<Skeleton height={100} mt="5" style={{ opacity: "75%" }} />
			<Skeleton height={100} mt="5" style={{ opacity: "50%" }} />
			<Skeleton height={100} mt="5" style={{ opacity: "25%" }} />
		</>
	);
};

export default SkeletonBox;
