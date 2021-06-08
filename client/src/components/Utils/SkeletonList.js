import React from "react";
import { Flex, Skeleton } from "@chakra-ui/react";

const SkeletonList = () => {
	return (
		<>
			<Skeleton height={150} />
			<Flex m="5">
				<Flex width="100%" flexDirection="column">
					<Skeleton height={100} mb="1" />
					<Skeleton height={100} mb="1" />
					<Skeleton height={100} mb="1" />
					<Skeleton height={100} mb="1" style={{ opacity: "75%" }} />
					<Skeleton height={100} mb="1" style={{ opacity: "50%" }} />
					<Skeleton height={100} mb="1" style={{ opacity: "25%" }} />
				</Flex>
				<Flex ml="5" width="400px" flexDirection="column">
					<Skeleton height={300} mb="3" />
					<Skeleton height={231} mb="3" style={{ opacity: "50%" }} />
				</Flex>
			</Flex>
		</>
	);
};

export default SkeletonList;
