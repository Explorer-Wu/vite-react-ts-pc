import { useNavigate, useLocation, useHref, useLinkClickHandler } from 'react-router-dom';

export default function HistoryRule() {
	const HistoryNav = useNavigate();
	let Location = useLocation();

	return {
		HistoryNav,
		Location,
	};
}

export const HrefTo = to => useHref(to);
export const LinkNav = ({ replace, state, target, to }) =>
	useLinkClickHandler(to, {
		replace,
		state,
		target,
	});
export const LinkTo = (to: any, action: any = { replace: true }) => {
	const HistoryNav = useNavigate();
	return HistoryNav(to, action); // history 的 replace 模式
};
