import { useNavigate, useLocation } from "react-router-dom"; // , useHref, useLinkClickHandler

export default function HistoryRule() {
	// const { replace, state, target, to } = props;
	const HistoryNav = useNavigate();
	let Location = useLocation();

	// let HrefTo = useHref(to);
	// let LinkNav = useLinkClickHandler(to, {
	// 	replace,
	// 	state,
	// 	target,
	// });

	return {
		HistoryNav,
		Location,
		// HrefTo,
		// LinkNav,
	};
}
