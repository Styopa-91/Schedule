import React from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Link } from 'react-router-dom';
import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { RESET_PASSWORD_FORM } from '../../constants/reduxForms';
import { authTypes } from '../../constants/auth';

import { email, required } from '../../validation/validateFields';
import { links } from '../../constants/links';

const ResetPasswordForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, translation, resetPasswordError, setError, switchAuthMode, isLoading } =
        props;

    const error = resetPasswordError;

    const emailValidate = { validate: [required, email] };

    const errorHandling = (value) => {
        if (required(value)) {
            setError(required(value));
        } else {
            setError(null);
        }
    };

    let form = (
        <form onSubmit={handleSubmit}>
            <Field
                name="email"
                className="form-field"
                component={renderTextField}
                label={t('email_label')}
                {...(!error ? emailValidate : error)}
                onChange={(e) => {
                    errorHandling(e.target.value);
                }}
            />
            <Button
                className="buttons-style under-line"
                type="submit"
                variant="contained"
                color="primary"
            >
                {translation('reset_password_button')}
            </Button>
            <div className="group-btns">
                <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                        switchAuthMode(authTypes.LOGIN);
                        setError(null);
                    }}
                >
                    <Link className="navLinks" to={links.LOGIN}>
                        {translation('login_page_title')}
                    </Link>
                </button>
            </div>
        </form>
    );

    if (isLoading) {
        form = <CircularProgress />;
    }

    return (
        <Card additionClassName="auth-card">
            <h2 className="under-line">{translation('reset_password_page_title')}</h2>
            {form}
        </Card>
    );
};

const ResetPasswordReduxForm = reduxForm({
    form: RESET_PASSWORD_FORM,
})(ResetPasswordForm);

export default ResetPasswordReduxForm;
