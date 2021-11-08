import React from 'react';

const Page: React.FC & { noLayout: boolean } = () => <h1>地图</h1>;

Page.noLayout = true;

export default Page;