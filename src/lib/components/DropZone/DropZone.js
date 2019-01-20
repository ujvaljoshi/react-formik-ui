import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Dropzone from 'react-dropzone'
import { connect, getIn } from 'formik'
import Thumb from './Thumb'
import './styles.css'

const DropZone = ({
  formik,
  className,
  disabled,
  hint,
  label,
  name,
  required,
  accept,
  zoneActiveText,
  disabledText,
  placeholder,
  ...rest
}) => {
  const {
    touched, errors, values, setFieldValue, setFieldTouched,
  } = formik
  const error = getIn(errors, name)
  const touch = getIn(touched, name)
  const errorMsg = touch && error ? error : null

  return (
    <div className={cx('form-element dropzone-wrapper', className, { hasError: !!errorMsg, disabled })}>
      {
        label && (
          <label htmlFor={name}>
            {`${label}${required ? ' *' : ''}`}
          </label>
        )
      }
      <Dropzone
        className="dropzone"
        accept={accept}
        disabled={disabled}
        onDrop={acceptedFiles => {
          if (acceptedFiles.length === 0) { return }
          setFieldValue(name, values[name].concat(acceptedFiles))
          setFieldTouched(name, true)
        }}
        {...rest}
      >
        {
          ({ isDragActive, acceptedFiles, rejectedFiles }) => {
            if (disabled) { return disabledText }
            if (isDragActive) { return zoneActiveText }

            return acceptedFiles.length || rejectedFiles.length
              ? (
                <Fragment>
                  {values[name].map(file => (<Thumb key={file.name} file={file} />))}
                  <div className="fileInfo">
                    {`Accepted ${acceptedFiles.length}, rejected ${rejectedFiles.length} files`}
                  </div>
                </Fragment>
              ) : placeholder
          }
        }
      </Dropzone>
      {
        errorMsg && (
          <span className="error">
            {errorMsg}
          </span>
        )
      }
      {
        hint && (
          <span className="hint">
            {hint}
          </span>
        )
      }
    </div>
  )
}

DropZone.propTypes = {
  formik: PropTypes.object.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  accept: PropTypes.string,
  zoneActiveText: PropTypes.string,
  disabledText: PropTypes.string,
  placeholder: PropTypes.string,
}

DropZone.defaultProps = {
  className: null,
  disabled: false,
  hint: null,
  id: null,
  label: null,
  required: false,
  accept: 'image/*',
  zoneActiveText: 'Drop file(s) here',
  disabledText: 'File upload disabled',
  placeholder: 'Dropp some files here.',
}

export default connect(DropZone)