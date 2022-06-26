import React, { lazy, ReactNode, Suspense } from 'react';
import { RouteObject, Navigate, useRoutes } from 'react-router-dom';
// 用懒加载实现优化
const Root = lazy(() => import('@/layouts/LayoutTemp'));
// const OverView = lazy(() => import("@/views/Overview/index"));
const Home = lazy(() => import('@/views/home/index'));
const NotFound = lazy(() => import('@/views/error/index'));

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children: ReactNode): ReactNode => {
	return <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>;
};

const routes: RouteObject[] = [
	{
		path: '/',
		element: <Navigate to={'/views/home'} replace />,
	},
	{
		path: '/views',
		element: <Navigate to={'/views/home'} replace />,
	},
	{
		path: '/views',
		element: <Root />,
		children: [
			{
				path: 'home',
				element: lazyLoad(<Home />),
			},
			// {
			//   path: "tables",
			//   element: <Tables/>,
			//   children: [
			//     { index: true, element: <TableList /> },
			//     { path: ":id", element: <TableDetail /> }
			//   ]
			// },
			// {
			//     path: '/signin',
			//     element: <Signin/>,
			//     requiresAuth: false,
			// },
			// {
			//     path: "/users",
			//     element: <Users/>,
			// },
			{
				path: 'error',
				element: lazyLoad(<NotFound />),
			},
		],
	},
	{
		path: '/*',
		element: <Navigate to={'/views/error'} replace />,
	},
];

function WrapRoutes() {
	const routerComponents = useRoutes(routes);
	return routerComponents;
}

export { routes, WrapRoutes };
