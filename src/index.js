import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import BackspaceIcon from 'material-ui/svg-icons/content/backspace';
import IconButton from 'material-ui/IconButton';
import {FieldTitle} from 'admin-on-rest';

export const datify = input => {
    if (!input) {
        return null;
    }

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateTimeInput extends Component {
    
    onChange = (_, date) => {
        if (this.props.input.value) {
            let tempDate = new Date(this.props.input.value);
            date.setHours(tempDate.getHours());
            date.setMinutes(tempDate.getMinutes());
            date.setSeconds(tempDate.getSeconds());
        }

        this.props.input.onChange(date);
        this.props.input.onBlur();
        if (!this.props.disableCascadeCalling) {
            this.refs[`${this.props.source}.timePicker`].openDialog();
        }
    };

    onChangeTime = (_, time) => {
        this.props.input.onChange(time);
        this.props.input.onBlur();
    };

    clearDate = () => {
        this.props.input.onChange(null);
        this.props.input.onBlur();
    };

  /**
   * This aims to fix a bug created by the conjunction of
   * redux-form, which expects onBlur to be triggered after onChange, and
   * material-ui, which triggers onBlur on <DatePicker> when the user clicks
   * on the input to bring the focus on the calendar rather than the input.
   *
   * @see https://github.com/erikras/redux-form/issues/1218#issuecomment-229072652
   */
    onBlur = () => {};

    onDismiss = () => this.props.input.onBlur();

    render() {
        // elStyle deleted because timepicker has not container prop and always show as dialog. for same showing date and time pickers.
        const {
            input,
            isRequired,
            label,
            meta: { touched, error },
            options,
            optionsTime,
            source,
            resource,
            labelTime,
            timeFormat,
            children,
            disableCascadeCalling,
            disableClearDateButton
        } = this.props;

        let defaultDatePickerOpts = {
            errorText: touched && error,
            floatingLabelText: React.createElement(
                FieldTitle,
                {
                    label: label,
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }, null
            ),
            DateTimeFormat: Intl.DateTimeFormat,
            mode: 'portrait',
            container: 'dialog',
            autoOk: true,
            value: datify(input.value),
            onChange: this.onChange,
            onBlur: this.onBlur,
            onDismiss: this.onDismiss,
            style: {display: 'inline-block', marginRight: '10px'},
            ref: `${this.props.source}.datePicker`
        }

        let defaultTimePickerOpts = {
            errorText: touched && error,
            floatingLabelText: React.createElement(
                FieldTitle,
                {
                    label: labelTime ? labelTime : 'Time(hours, mins.)',
                    source: source,
                    resource: resource,
                    isRequired: isRequired
                }, null
            ),
            format: timeFormat ? timeFormat : '24hr',
            autoOk: true,
            value: datify(input.value),
            onChange: this.onChangeTime,
            onBlur: this.onBlur,
            onDismiss: this.onDismiss,
            style: {display: 'inline-block', marginRight: '10px'},
            ref: `${this.props.source}.timePicker`
        }

        let clearDateElement = (
            <IconButton onClick={this.clearDate} tooltip="Clear Date" tooltipPosition="top-right">
                <BackspaceIcon color='grey' hoverColor='black'/>
            </IconButton>
        )

        if (children) {
            return (
                <div>
                { children.map(
                    (child, index) => {
                        let childOpts = {};
                        if (child.type === DatePicker) {
                            childOpts = defaultDatePickerOpts;
                        } else if (child.type === TimePicker){
                            childOpts = defaultTimePickerOpts;
                        }
                        return React.createElement(
                            child.type,
                            {
                            ...input,
                            ...childOpts,
                            ...child.props.options,
                            errorText: touched && error,
                            value: datify(input.value),
                            key: index
                            },
                            null
                        );
                    }
                ) }
                {
                    !disableClearDateButton ?
                    clearDateElement : null
                }
                </div>
            )
        };

        return (
            <div>
                <DatePicker
                    {...input}
                    {...defaultDatePickerOpts}
                    {...options} />

                <TimePicker
                    {...input}
                    {...defaultTimePickerOpts}
                    {...optionsTime} />
                {
                    !disableClearDateButton ?
                    clearDateElement : null
                }
            </div>
        );
    }
}

DateTimeInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelTime: PropTypes.string
};

DateTimeInput.defaultProps = {
    addField: true,
    options: {},
};

export default DateTimeInput;
export { DatePicker, TimePicker };
