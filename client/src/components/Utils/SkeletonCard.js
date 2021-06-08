import React from "react";
import { Container, Skeleton } from "@chakra-ui/react";

const SkeletonBox = () => {
	return (
		<Container mt="5" maxW="container.lg">
			<Skeleton height={300} />
			<Skeleton height={100} mt="2" />
			<Skeleton height={100} mt="2" />
			<Skeleton height={100} mt="2" style={{ opacity: "75%" }} />
			<Skeleton height={100} mt="2" style={{ opacity: "50%" }} />
			<Skeleton height={100} mt="2" style={{ opacity: "25%" }} />
		</Container>
	);
};

export default SkeletonBox;
