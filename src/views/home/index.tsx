import React, { useEffect, useState } from "react";
import { Card, Tag, Button } from "antd";
import { useCounter } from '@/storehooks/useCounter';
// 使用svg as ReactComponent 在d.ts文件加 <reference types="vite-plugin-svgr/client" />
import { ReactComponent as Logo } from '@/assets/images/logo.svg';

type CounterProps = {
  initNum?: number;
  // title: string;
  // children: React.ReactNode;
}

const Home: React.FC<any> = (props: CounterProps) => {
  const { initNum } = props;
  const { count, increment } = useCounter(initNum);
	// useEffect(() => {
	// 	const Timer = setInterval(() => {
	// 		setCount(prev => prev + 1);
	// 	}, 1000);

	// 	return () => clearInterval(Timer);
	// }, []);

	return (
		<Card title="HomePage">
      <Logo height="240" width="240" />
      {/* <img src={Logo} height="240" width="240"/> */}
      <h1>Vite + Jest + React</h1>
      <p>
        mounted start <Tag color="cyan">count is: {count}</Tag> unmounted clear
      </p>
      <Button type="primary" size="large" onClick={increment}>
        counter
      </Button>
     
      <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
		</Card>
	);
};

export default Home;


