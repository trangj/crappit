import React from "react";
import { Flex, Skeleton } from "@chakra-ui/react";

const height = 93;

const SkeletonList = () => {
	return (
		<Flex width="100%" flexDirection="column">
			<Skeleton height={height} mb="1px" borderTopRadius="md" />
			<Skeleton height={height} mb="1px" />
			<Skeleton height={height} mb="1px" />
			<Skeleton height={height} mb="1px" />
			<Skeleton height={height} mb="1px" opacity="75%" />
			<Skeleton height={height} mb="1px" opacity="50%" />
			<Skeleton height={height} mb="1px" opacity="25%" />
		</Flex>
	);
};

export default SkeletonList;
