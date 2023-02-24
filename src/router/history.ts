import { useNavigate, useLocation, useHref, useLinkClickHandler } from 'react-router-dom';

const HistoryNav = useNavigate();

export default function HistoryRule() {
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
export const LinkTo = (to: any, action: any = { replace: true }) => HistoryNav(to, action); // history 的 replace 模式
