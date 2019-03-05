const React = require('react')
const PropTypes = require('prop-types')
const { Button, Modal, ModalHeader, ModalBody, ModalFooter } = require('reactstrap')

const { createContext, Component, Fragment } = React

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

class ButtonModal extends Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
    this.onComplete = this.onComplete.bind(this)
    this.delete = this.delete.bind(this)
  }

  toggle () {
    this.setState(prevState => ({
      open: !prevState.open
    }))
  }

  onComplete () {
    this.toggle()
    this.props.onComplete && this.props.onComplete(this.props)
  }

  render () {
    return (
      <Fragment>
        <Button className={this.props.className} color={this.props.color}>
          {this.props.children}
        </Button>
        <Modal isOpen={this.state.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>
            {this.props.content}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.onComplete}>Ok</Button>
            <Button color='secondary' onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

ButtonModal.propTypes = {
  children: PropTypes.node.isRequired,
  onComplete: PropTypes.function,
  title: PropTypes.string,
  content: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string
}

module.exports = { Form, ButtonModal, context }
