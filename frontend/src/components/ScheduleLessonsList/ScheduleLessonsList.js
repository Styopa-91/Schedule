import React from 'react';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { styled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Board from '../Board/Board';
import ScheduleItem from '../ScheduleItem/ScheduleItem';

import { selectGroupIdService } from '../../services/lessonService';

import { firstStringLetterCapital } from '../../helper/strings';
import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';
import {
    COMMON_SELECT_GROUP_SCHEDULE,
    LESSON_NO_LESSON_FOR_GROUP_LABEL,
} from '../../constants/translationLabels/common';

const GroupField = styled(TextField)({
    width: '150px',
});

const ScheduleLessonsList = (props) => {
    const { groups, groupId, lessons, items, translation: t } = props;

    const handleGroupSelect = (group) => {
        if (group) selectGroupIdService(group.id);
    };

    const groupFinderHandle = (groupIdProp) => {
        if (groupIdProp) return groups.find((group) => group.id === groupIdProp);
        return '';
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };

    const firstStringLetterCapitalHandle = (str) => {
        return firstStringLetterCapital(str);
    };

    const lessonItems = (lesson) => {
        const { hours } = lesson;
        const lessonItem = [];
        let els = [];
        let hoursInSchedule = 0;

        if (items.length > 0) {
            els = items.filter((item) => item.lesson.id === lesson.id);
        }

        els.forEach(() => {
            hoursInSchedule += 1;
        });

        for (let i = 0; i < hours - hoursInSchedule; i += 1) {
            lessonItem.push(
                <section key={lesson.id + i}>
                    <ScheduleItem
                        index={i}
                        lesson={lesson}
                        lessons={lessons}
                        fStrLetterCapital={firstStringLetterCapitalHandle}
                        translation={t}
                        classScheduler={props.classScheduler}
                    />
                </section>,
            );
        }
        return lessonItem;
    };

    return (
        <>
            {t(COMMON_SELECT_GROUP_SCHEDULE)}
            <Autocomplete
                {...defaultProps}
                id="group"
                clearOnEscape
                openOnFocus
                value={groupFinderHandle(groupId)}
                onChange={(_, newValue) => {
                    handleGroupSelect(newValue);
                }}
                renderInput={(params) => (
                    <GroupField {...params} label={t(FORM_GROUP_LABEL)} margin="normal" />
                )}
            />
            {lessons.length > 0 ? (
                <Board className="board lesson-board">
                    {lessons.map((lesson) => lessonItems(lesson))}
                </Board>
            ) : (
                groupId && t(LESSON_NO_LESSON_FOR_GROUP_LABEL)
            )}
        </>
    );
};

export default ScheduleLessonsList;