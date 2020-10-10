import React from 'react'
import { Spin } from 'antd';

/**
 *   Suspense mode loader
 */
const AppLoader = () => (
	<div style={{ position: 'absolute', left: '50%', bottom: '40%' }}>
		<Spin />
	</div>
)

export default AppLoader
