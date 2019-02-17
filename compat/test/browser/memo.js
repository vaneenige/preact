import { setupScratch, setupRerender, teardown } from '../../../test/_util/helpers';
import { Component, render } from '../../src';
import { createElement as h, memo } from '../../src/';

/** @jsx h */

describe('memo()', () => {
	let scratch, rerender;

	beforeEach(() => {
		scratch = setupScratch();
		rerender = setupRerender();
	});

	afterEach(() => {
		teardown(scratch);
	});

	it('should work with class components', () => {
		let spy = sinon.spy();

		class Foo extends Component {
			render() {
				spy();
				return <h1>Hello World</h1>;
			}
		}

		let Memoized = memo(Foo);

		let update;
		class App extends Component {
			constructor() {
				super();
				update = () => this.setState({});
			}
			render() {
				return <Memoized />;
			}
		}
		render(<App />, scratch);

		expect(spy).to.be.calledOnce;

		update();
		rerender();

		expect(spy).to.be.calledOnce;
	});

	it('should work with function components', () => {
		let spy = sinon.spy();

		function Foo() {
			spy();
			return <h1>Hello World</h1>;
		}

		let Memoized = memo(Foo);

		let update;
		class App extends Component {
			constructor() {
				super();
				update = () => this.setState({});
			}
			render() {
				return <Memoized />;
			}
		}
		render(<App />, scratch);

		expect(spy).to.be.calledOnce;

		update();
		rerender();

		expect(spy).to.be.calledOnce;
	});

	it('should support custom comparer functions', () => {
		function Foo() {
			return <h1>Hello World</h1>;
		}

		let spy = sinon.spy(() => true);
		let Memoized = memo(Foo, spy);

		let update;
		class App extends Component {
			constructor() {
				super();
				update = () => this.setState({});
			}
			render() {
				return <Memoized />;
			}
		}
		render(<App />, scratch);

		update();
		rerender();

		expect(spy).to.be.calledOnce;
		expect(spy).to.be.calledWith({}, {});
	});

	it('should rerender when custom comparer returns false', () => {
		const spy = sinon.spy();
		function Foo() {
			spy();
			return <h1>Hello World</h1>;
		}

		const App = memo(Foo, () => false);
		render(<App />, scratch);
		expect(spy).to.be.calledOnce;

		render(<App foo="bar" />, scratch);
		expect(spy).to.be.calledTwice;
	});

	it('should ignore shouldComponentUpdate', () => {
		const spy = sinon.spy();
		class Foo extends Component {
			shouldComponentUpdate() {
				return false;
			}

			render() {
				spy();
				return <h1>Hello World</h1>;
			}
		}

		const App = memo(Foo, () => false);
		render(<App />, scratch);
		expect(spy).to.be.calledOnce;

		render(<App foo="bar" />, scratch);
		expect(spy).to.be.calledTwice;
	});
});
