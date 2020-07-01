import axios from '../helper/axios';
import { errorHandler, successHandler } from '../helper/handlerAxios';

import { store } from '../index';

import {
    TEACHER_TEMPORARY_SCHEDULE,
    TEMPORARY_SCHEDULE_URL
} from '../constants/axios';

import { setLoadingService } from './loadingService';

import {
    deleteTemporarySchedule,
    selectTemporarySchedule,
    setSchedulesAndTemporarySchedules,
    setTemporarySchedules
} from '../redux/actions/index';
import { selectTeacherId } from '../redux/actions/temporarySchedule';

import i18n from '../helper/i18n';

export const getTemporarySchedulesService = (from, to) => {
    axios
        .get(TEMPORARY_SCHEDULE_URL, { params: { from, to } })
        .then(response => {
            store.dispatch(setSchedulesAndTemporarySchedules([]));
            store.dispatch(setTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getTeacherTemporarySchedulesService = (teacherId, from, to) => {
    axios
        .get(TEACHER_TEMPORARY_SCHEDULE, { params: { teacherId, from, to } })
        .then(response => {
            store.dispatch(setTemporarySchedules([]));
            store.dispatch(setSchedulesAndTemporarySchedules(response.data));
            setLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const deleteTemporaryScheduleService = temporaryScheduleId => {
    axios
        .delete(TEMPORARY_SCHEDULE_URL + `/${temporaryScheduleId}`)
        .then(() => {
            store.dispatch(deleteTemporarySchedule(temporaryScheduleId));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:temporary_schedule_label'),
                    actionType: i18n.t('serviceMessages:deleted_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
        });
};

export const addTemporaryScheduleService = (teacherId, formValues) => {
    formValues.date = formValues.date.replace(/\//g, '-');
    axios
        .post(TEMPORARY_SCHEDULE_URL, {
            ...formValues,
            teacher: !teacherId ? null : { id: teacherId }
        })
        .then(() => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:temporary_schedule_label'),
                    actionType: i18n.t('serviceMessages:created_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
        });
};

export const selectTemporaryScheduleService = temporarySchedule => {
    store.dispatch(selectTemporarySchedule(temporarySchedule));
};

export const selectTeacherIdService = teacherId => {
    store.dispatch(selectTeacherId(teacherId));
};
