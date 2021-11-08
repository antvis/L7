import React from 'react';
import Map from '../components/rumbling'

const Page: React.FC & { noLayout: boolean } = () => <Map/>;

Page.noLayout = true;

export default Page;