import { src, webpackConfig, expectErrors, tsconfig, compile, install, entry, spec } from './utils'

spec(__filename, async function() {
	install('react', 'react-dom', '@types/react', '@types/react-dom')

	src(
		'index.tsx',
		`
        import * as React from 'react'
        import * as ReactDOM from 'react-dom'
        import App from './app'
        ReactDOM.render(<App title='Test' />, document.body)
    `
	)

	src(
		'app.tsx',
		`
        import * as React from 'react'

        export default class App extends React.Component<{title: string}, {}> {
            render() {
                return <div>{ this.props.title }</div>
            }
        }
    `
	)

	tsconfig({
		jsx: 'react'
	})

	let stats = await compile(webpackConfig(entry('index.tsx')))

	expectErrors(stats, 0)
})
