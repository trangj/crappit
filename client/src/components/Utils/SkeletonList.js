import React from "react";
import { Flex, Skeleton } from "@chakra-ui/react";

const SkeletonList = () => {
	return (
		<Flex width="100%" flexDirection="column">
			<Skeleton height={100} mb="1px" borderTopRadius="lg" />
			<Skeleton height={100} mb="1px" />
			<Skeleton height={100} mb="1px" />
			<Skeleton height={100} mb="1px" opacity="75%" />
			<Skeleton height={100} mb="1px" opacity="50%" />
			<Skeleton height={100} mb="1px" opacity="25%" />
		</Flex>
	);
};

export default SkeletonList;
