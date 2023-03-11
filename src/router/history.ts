import { useNavigate, useLocation, useHref, useLinkClickHandler } from 'react-router-dom';

export default function HistoryRule() {
	const HistoryNav = useNavigate();
	const HrefTo = to => useHref(to);
	let Location = useLocation();
	const LinkNav = ({ replace, state, target, to }) =>
		useLinkClickHandler(to, {
			replace,
			state,
			target,
		});

	const LinkTo = (to: any, action: any = { replace: true }) => {
		return HistoryNav(to, action); // history 的 replace 模式
	};

	return {
		HistoryNav,
		LinkTo,
		Location,
		HrefTo,
		LinkNav,
	};
}
