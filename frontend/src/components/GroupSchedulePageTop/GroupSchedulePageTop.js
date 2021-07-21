import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import { MdPlayArrow } from 'react-icons/md';

import renderSelectField from '../../share/renderedFields/select';

import {
    showAllPublicSemestersService,
    showAllPublicGroupsService,
    showAllPublicTeachersService
} from '../../services/scheduleService';

import './GroupSchedulePageTop.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '../../share/Card/Card';

import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';
import { required } from '../../validation/validateFields';
import {useLocation} from 'react-router-dom';
import schedule from '../../redux/reducers/schedule';
import { MenuItem, Select } from '@material-ui/core';
import { places } from '../../constants/places';
const shortid = require('shortid');

const useStyles = makeStyles(theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    }
}));

const GroupSchedulePageTop = props => {
    const classes = useStyles();
    const { t } = useTranslation('common');
    const {
        groups,
        teachers,
        semesters,
        handleSubmit,
        pristine,
        submitting
    } = props;
    const isLoading = props.loading;
    const [sem,setSemester]=useState(props.initialValues.semester)
    let loadingContainer = '';
    if (isLoading) {
        loadingContainer = (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }
    useEffect(() => showAllPublicGroupsService(), []);
    useEffect(() => showAllPublicTeachersService(), []);
    useEffect(() => showAllPublicSemestersService(), []);
    
    const renderSemesterList = () => {
        if (semesters) {
            if (semesters.length > 1) {

                return (
                    <Field
                        id="semester"
                        name="semester"
                        component={renderSelectField}
                        label={t('formElements:semester_label')}
                        type="text"
                        validate={[required]}



                    >
                        <option />
                        {semesters.map((semester, index) => (

                            <option
                                key={shortid.generate()}
                                value={semester.id}

                            >
                                {semester.description}
                            </option>

                        ))}
                    </Field>
                );
            }
            else if (semesters.length === 1) {
                console.log("semesters")
                handleSubmit({ semester: semesters[0].id });
                return <p>{semesters[0].description}</p>;
            }
        }
    };
    const renderTeacherList=()=>{
      return  (<Field
            id="teacher"
            name="teacher"
            component={renderSelectField}
            label={t('formElements:teacher_label')}
            type="text"
            onChange={() => props.change('group', 0)}

        >
            <option />
            {teachers.map((teacher, index) => (
                <option
                    key={shortid.generate()}
                    value={teacher.id}
                >
                    {teacher.surname +
                    ' ' +
                    teacher.name +
                    ' ' +
                    teacher.patronymic}
                </option>
            ))}
        </Field>)
    };
    const renderGroupList=()=>{
       return (<Field
            id="group"
            name="group"
            component={renderSelectField}
            label={t('formElements:group_label')}
            type="text"
            onChange={() => {
                props.change('teacher', 0);
            }}
        >
            <option />
            {groups.map((group, index) => (
                <option
                    key={shortid.generate()}
                    value={group.id}
                >
                    {group.title}
                </option>
            ))}
        </Field>)
    }

    useEffect(()=>{
        console.log("useEffect", props)

        props.initialize({
            semester:props.initialValues.semester,
            group: props.initialValues.group,
            teacher:props.initialValues.teacher
        })
    },[])




    return (
        <section className={classes.root}>
            {console.log("Top",props)}
            <p>{t('greetings_schedule_message')}</p>
            <p>{t('greetings_schedule_message_hint')}</p>
            <section className="form-buttons-container top">
                <Card class="form-card width-auto">
                    <form onSubmit={handleSubmit}>
                        {renderSemesterList()}
                        {renderGroupList()}
                        {renderTeacherList()}

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={pristine || submitting}

                        >

                            <MdPlayArrow
                                title={t('teacher_schedule_label')}
                                className="svg-btn"
                            />
                        </Button>

                    </form>

                </Card>
                <Select className="place"
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    value={props.place}
                    onChange={props.onChange}
                >

                    {
                        Object.entries(places).map(function(data,index) {
                            return <MenuItem value={data[1]} key={data[0]}>{data[1]}</MenuItem>
                        }, this)
                    }

                </Select>
            </section>
            {loadingContainer}
        </section>
    );
};

const mapStateToProps = state => ({
    groups: state.groups.groups,
    teachers: state.teachers.teachers,
    semesters: state.schedule.semesters,
    loading: state.loadingIndicator.loading,
    initialValues:{semester: state.schedule.scheduleSemesterId,group: state.schedule.scheduleGroupId,teacher: state.schedule.scheduleTeacherId},

});
export default connect(mapStateToProps)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM
    })(GroupSchedulePageTop)
);


