const React = require('react')
const PropTypes = require('prop-types')

const { createContext, Component } = React

const context = createContext()
const { Provider } = context

class Form extends Component {
  constructor (props) {
    super(props)
    this.state = {
      values: props.values,
      errors: {}

    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    this.props.onSubmit(this.state)
  }

  render () {
    const { children, onChange } = this.props
    const { values, errors } = this.state
    const value = {
      set: this.setState,
      values,
      errors,
      onChange
    }
    return (<Provider value={value}><form onSubmit={this.onSubmit}>{children}</form></Provider>)
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  values: PropTypes.object,
  onSubmit: PropTypes.function,
  onChange: PropTypes.function
}

module.exports = { Form, context }
