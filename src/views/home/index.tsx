import React, { useEffect, useState } from "react";
import { Card, Tag, Button } from "antd";
// use svg as ReactComponent
import { ReactComponent as Logo } from '@/assets/images/logo.svg';

const Home: React.FC<any> = () => {
	const [count, setCount] = useState(0);

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
      <p>
        <Button type="primary" size="large" onClick={() => setCount((num) => num + 1)}>
          counter
        </Button>
        mounted start <Tag color="cyan">count：{count}</Tag> unmounted clear
      </p>
     
			
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


