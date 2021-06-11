import React from "react";
import { Container, Skeleton } from "@chakra-ui/react";

const SkeletonBox = () => {
	return (
		<Container>
			<Skeleton height={300} borderRadius="md" />
			<Skeleton height={100} mt="2" borderRadius="md" />
			<Skeleton height={100} mt="2" borderRadius="md" />
			<Skeleton height={100} mt="2" opacity="75%" borderRadius="md" />
			<Skeleton height={100} mt="2" opacity="50%" borderRadius="md" />
			<Skeleton height={100} mt="2" opacity="25%" borderRadius="md" />
		</Container>
	);
};

export default SkeletonBox;
