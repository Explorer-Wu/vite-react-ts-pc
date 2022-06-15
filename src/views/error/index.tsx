// import { withRouter } from "react-router-dom";
import React from "react";

export default function NoMatch(props: {}, context?: any): React.ReactElement<any, any> | null {
	return (
		<>
			<h3 className="error">
				No match for
				{/* <code>{props.location.pathname}</code> */}
			</h3>
		</>
	);
}
