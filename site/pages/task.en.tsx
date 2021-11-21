import React from 'react';
import Loadable from "@loadable/component"
const Map = Loadable(() => import("../components/task"))
const Page: React.FC & { noLayout: boolean } = () => <Map/>;

Page.noLayout = true;

export default Page;