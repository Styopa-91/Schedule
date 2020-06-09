import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '../share/Card/Card';

import i18next from './i18n';

import { daysUppercase } from '../constants/schedule/days';

const shortid = require('shortid');

const matchDayNumberSysytemToDayName = () => {
    var now = new Date();
    return daysUppercase[now.getDay() - 1];
};
const currentDay = matchDayNumberSysytemToDayName();

const getWeekNumber = (startScheduleDate, date) => {
    const parsed = Array.from(startScheduleDate);

    const startDay = new Date(
        parsed[3] +
            parsed[4] +
            parsed[5] +
            parsed[0] +
            parsed[1] +
            parsed[2] +
            parsed[6] +
            parsed[7] +
            parsed[8] +
            parsed[9]
    );

    const numberOfDays = Math.floor((date - startDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
};
const printWeekNumber = startScheduleDate => {
    var date = new Date();
    var result = getWeekNumber(startScheduleDate, date);
    return result;
};
function isOddFunction(num) {
    return num % 2;
}
let currentWeekType = 0;

const renderClassCell = classItem =>
    classItem.class_name +
    '\n\r\n\r' +
    classItem.startTime +
    ' - ' +
    classItem.endTime;

export const prepareLessonCardCell = card => {
    let inner = '';
    if (card !== undefined && card !== null) {
        inner = card.teacherForSite + '\n\r' + card.subjectForSite;
    }
    return inner;
};
export const prepareLessonSubCardCell = card => {
    let inner = '';
    if (card !== undefined && card !== null) {
        inner =
            '( ' +
            i18next.t(
                `formElements:lesson_type_${card.lessonType.toLowerCase()}_label`
            );
        if (card.room) {
            inner += ', ' + card.room.name + ' )';
        }
    }
    return inner;
};

export const renderGroupDayClass = (classDay, isOddWeek) => {
    let res = [];
    for (let [key, value] of Object.entries(classDay.cards)) {
        value.day = key;
        res.push(value);
    }
    return (
        <TableRow key={shortid.generate()}>
            <TableCell className=" lesson groupLabelCell">
                {renderClassCell(classDay.class)}
            </TableCell>
            {res.map(day => {
                let className = 'lesson ';
                if (currentDay === day.day && currentWeekType === isOddWeek) {
                    className += ' currentDay';
                }
                return (
                    <TableCell key={shortid.generate()} className={className}>
                        <p>{prepareLessonCardCell(day.card, currentDay)}</p>
                        <p>{prepareLessonSubCardCell(day.card, currentDay)}</p>
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

export const renderScheduleGroupHeader = daysUppercase => (
    <TableHead>
        <TableRow>
            <TableCell className="groupLabelCell"></TableCell>
            {daysUppercase.map(day => (
                <TableCell key={shortid.generate()}>
                    {i18next.t(`day_of_week_${day}`)}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

export const renderGroupTable = (classes, isOdd, semester) => {
    if (semester) {
        currentWeekType = isOddFunction(printWeekNumber(semester.startDay));
    }
    return (
        <TableContainer>
            <Table aria-label="sticky table">
                {renderScheduleGroupHeader(daysUppercase)}
                <TableBody>
                    {classes.map((classDay, classIndex) => {
                        if (classDay) {
                            return renderGroupDayClass(classDay, isOdd);
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const renderGroupCells = (
    groups,
    isOdd = 0,
    currentWeekType = 0,
    isCurrentDay = 0
) => {
    return groups.map((group, groupIndex) => {
        var colspan = 1;
        var rowspan = 1;
        var classname = 'lesson';

        if (currentWeekType === isOdd && isCurrentDay) {
            classname += ' currentDay';
        }
        if (group.card !== null && group.card.skip_render === 1) {
            return;
        }
        if (group.card !== null && group.card.weekly_render === 1) {
            rowspan = 2;
            classname += ' weekly';
        }

        for (let i = groupIndex; i < groups.length; i++) {
            if (
                group &&
                groups[i + 1] &&
                group.card !== null &&
                groups[i + 1].card !== null
            ) {
                if (
                    group.card.teacherForSite &&
                    group.card.teacherForSite ===
                        groups[i + 1].card.teacherForSite &&
                    group.card.subjectForSite ===
                        groups[i + 1].card.subjectForSite &&
                    group.card.room.id === groups[i + 1].card.room.id &&
                    group.card.weekly_render ===
                        groups[i + 1].card.weekly_render
                ) {
                    groups[i + 1].card.skip_render = 1;
                    colspan++;
                    classname += ' grouped';
                }
            }
        }
        return (
            <TableCell
                key={shortid.generate()}
                colSpan={colspan}
                rowSpan={rowspan}
                className={classname}
            >
                <p>{prepareLessonCardCell(group.card)}</p>
                <p>{prepareLessonSubCardCell(group.card)}</p>
            </TableCell>
        );
    });
};

export const renderScheduleHeader = groups => (
    <TableHead>
        <TableRow>
            <TableCell className="groupLabelCell" colSpan={3}>
                {i18next.t('group_y_label')}
            </TableCell>
            {groups.map(group => (
                <TableCell key={shortid.generate()}>{group}</TableCell>
            ))}
        </TableRow>
    </TableHead>
);

export const renderFirstDayFirstClassFirstCardLine = (
    day_name,
    classItem,
    groups,
    classesCount
) => {
    let dayClassName = 'dayNameCell ';
    let classClassName = 'classNameCell ';

    let oddWeekClass = '';
    let evenWeekClass = '';
    if (currentDay === day_name) {
        dayClassName += ' currentDay';

        if (currentWeekType === 1) {
            oddWeekClass = ' currentDay';
        } else {
            evenWeekClass = ' currentDay';
        }
    }

    if (groups.even.length <= 2 || groups.odd.length <= 2) {
        dayClassName += ' minHeightDouble';
    }

    return (
        <React.Fragment key={shortid.generate()}>
            <TableRow>
                <TableCell rowSpan={classesCount * 2} className={dayClassName}>
                    <span className="dayName">
                        <b>{i18next.t(`common:day_of_week_${day_name}`)}</b>
                    </span>
                </TableCell>
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell
                    className={classClassName + oddWeekClass + ' subClassName'}
                >
                    1
                </TableCell>
                {renderGroupCells(groups.odd)}
            </TableRow>
            <TableRow>
                <TableCell
                    className={classClassName + evenWeekClass + ' subClassName'}
                >
                    2
                </TableCell>
                {renderGroupCells(groups.even)}
            </TableRow>
        </React.Fragment>
    );
};

export const renderFirstDayOtherClassFirstCardLine = (
    day_name,
    classItem,
    groups
) => {
    let classClassName = 'classNameCell ';
    let oddWeekClass = '';
    let evenWeekClass = '';

    if (currentDay === day_name) {
        if (currentWeekType === 1) {
            oddWeekClass = ' currentDay';
        } else {
            evenWeekClass = ' currentDay';
        }
    }

    return (
        <React.Fragment key={shortid.generate()}>
            <TableRow>
                <TableCell className={classClassName} rowSpan={2}>
                    {renderClassCell(classItem)}
                </TableCell>
                <TableCell
                    className={classClassName + oddWeekClass + ' subClassName'}
                >
                    1
                </TableCell>
                {renderGroupCells(groups.odd, 1)}
            </TableRow>
            <TableRow>
                <TableCell
                    className={classClassName + evenWeekClass + ' subClassName'}
                >
                    2
                </TableCell>
                {renderGroupCells(groups.even, 0)}
            </TableRow>
        </React.Fragment>
    );
};

const prepareForRender = classItem => {
    if (classItem.cards) {
        classItem.cards.odd.forEach((card, cardIndex, map) => {
            if (
                classItem.cards.even[cardIndex] &&
                card.group.id === classItem.cards.even[cardIndex].group.id
            ) {
                if (
                    card.card !== null &&
                    classItem.cards.even[cardIndex].card !== null
                ) {
                    if (
                        card.card.teacherForSite ===
                            classItem.cards.even[cardIndex].card
                                .teacherForSite &&
                        card.card.subjectForSite ===
                            classItem.cards.even[cardIndex].card
                                .subjectForSite &&
                        card.card.room.id ===
                            classItem.cards.even[cardIndex].card.room.id
                    ) {
                        classItem.cards.odd[cardIndex].card.weekly_render = 1;
                        classItem.cards.even[cardIndex].card.skip_render = 1;
                    }
                }
            }
        });
    }
};

export const renderDay = (dayName, dayItem, semesterClassesCount) => {
    return dayItem.map((classItem, classIndex) => {
        prepareForRender(classItem);
        if (classIndex === 0) {
            return renderFirstDayFirstClassFirstCardLine(
                dayName,
                classItem.class,
                classItem.cards,
                semesterClassesCount
            );
        } else {
            return renderFirstDayOtherClassFirstCardLine(
                dayName,
                classItem.class,
                classItem.cards
            );
        }
    });
};

export const renderScheduleFullHeader = groupList => (
    <TableHead>
        <TableRow>
            <TableCell colSpan={3}>
                {i18next.t('formElements:group_label')}
            </TableCell>
            {groupList.map(group => (
                <TableCell key={shortid.generate()} className="groupLabelCell">
                    {group.title}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const renderScheduleDays = fullResultSchedule =>
    fullResultSchedule.resultArray.map((dayItem, dayName) => {
        return renderDay(
            dayItem.day,
            dayItem.classes,
            fullResultSchedule.semester_classes.length
        );
    });

export const renderFullSchedule = fullResultSchedule => {
    currentWeekType = isOddFunction(
        printWeekNumber(fullResultSchedule.semester.startDay)
    );
    let scheduleTitle = '';
    if (fullResultSchedule.semester) {
        scheduleTitle =
            fullResultSchedule.semester.description +
            ' (' +
            fullResultSchedule.semester.startDay +
            '-' +
            fullResultSchedule.semester.endDay +
            ')';
    }

    return (
        <>
            <h1>{scheduleTitle}</h1>
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleFullHeader(fullResultSchedule.groupList)}
                    <TableBody>
                        {renderScheduleDays(fullResultSchedule)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export const prepareTeacherCardCell = card => {
    let inner = '';
    if (card !== undefined && card !== null) {
        inner = card.subjectForSite;
    }
    return inner;
};

const renderClassRow = (classItem, days, scheduleRow) => (
    <TableRow key={shortid.generate()}>
        <TableCell className="lesson groupLabelCell">
            {renderClassCell(classItem)}
        </TableCell>
        {days.map(dayName => {
            if (scheduleRow) {
                return renderTeacherClassCell(
                    scheduleRow.find(clas => clas.day === dayName)
                );
            }
        })}
    </TableRow>
);
const renderTeacherClassCell = cards => {
    let cellText = '';
    let subCellText = '';
    let groupCellText = '';
    if (cards !== undefined) {
        cards.cards.map((card, cardIndex) => {
            if (cardIndex === 0) {
                cellText += prepareTeacherCardCell(card);
                subCellText +=
                    ' (' +
                    i18next.t(
                        `formElements:lesson_type_${card.lessonType.toLowerCase()}_label`
                    ) +
                    ', ' +
                    card.room +
                    ')';
                groupCellText +=
                    i18next.t('common:GroupList_management_title') + ': ';
            }
            groupCellText += card.group.title + ' ';
        });
    }
    return (
        <TableCell key={shortid.generate()} className="lesson">
            <p>{cellText}</p>
            <p>{subCellText}</p>
            <p>{groupCellText}</p>
        </TableCell>
    );
};
export const renderWeekTable = (schedule, isOdd) => {
    if (schedule) {
        return (
            <TableContainer>
                <Table aria-label="sticky table">
                    {renderScheduleGroupHeader(schedule.days)}
                    <TableBody>
                        {schedule.classes.map(classItem => {
                            return renderClassRow(
                                classItem,
                                schedule.days,
                                schedule.cards[classItem.id]
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
};

export const renderTeacherRangeSchedule = (
    schedule,
    viewTeacherScheduleResults
) => {
    if (schedule === undefined) return;
    if (schedule) {
        if (schedule.length === 0) {
            return i18next.t('empty_schedule');
        }
        return schedule.map((dayItem, dayIndex) => {
            const parsed = Array.from(dayItem.date);

            const startDay = new Date(
                parsed[3] +
                    parsed[4] +
                    parsed[5] +
                    parsed[0] +
                    parsed[1] +
                    parsed[2] +
                    parsed[6] +
                    parsed[7] +
                    parsed[8] +
                    parsed[9]
            );
            return (
                <Card
                    class={
                        viewTeacherScheduleResults +
                        ' ' +
                        'form-card teacher-schedule-day-card'
                    }
                    key={shortid.generate()}
                >
                    <h3>
                        {dayItem.date +
                            ' ( ' +
                            i18next.t(`day_of_week_${startDay.getDay() + 1}`) +
                            ' )'}
                    </h3>
                    {renderTeacherRangeDay(dayItem.schedule)}
                </Card>
            );
        });
    }
};

const renderLessonsFirstLine = lessonItem => {
    return (
        <>
            <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
            <TableCell>{lessonItem.lesson.group_name}</TableCell>
            <TableCell>{lessonItem.lesson.room.name}</TableCell>
        </>
    );
};

const renderLessonsRestLines = lessons => {
    if (lessons.length === 1) {
        return;
    }
    let lessonClassName = '';
    lessonClassName = 'groupped';
    lessons.forEach((lessonItem, lessonIndex) => {
        if (
            lessons[lessonIndex + 1] &&
            (lessonItem.lesson.subject_for_site !==
                lessons[lessonIndex + 1].lesson.subject_for_site ||
                lessonItem.lesson.room.id !==
                    lessons[lessonIndex + 1].lesson.room.id)
        ) {
            lessonClassName = 'overlap';
        }
    });
    return lessons.map((lessonItem, lessonIndex) => {
        if (lessonIndex === 0) {
            return;
        }
        return (
            <TableRow className={lessonClassName} key={shortid.generate()}>
                <TableCell>{lessonItem.lesson.subject_for_site}</TableCell>
                <TableCell>{lessonItem.lesson.group_name}</TableCell>
                <TableCell>{lessonItem.lesson.room.name}</TableCell>
            </TableRow>
        );
    });
};

const renderFirstLineTable = classItem => {
    return (
        <TableRow key={shortid.generate()}>
            <TableCell rowSpan={classItem.lessons.length}>
                {classItem.class.class_name +
                    ' ( ' +
                    classItem.class.startTime +
                    ' - ' +
                    classItem.class.endTime +
                    ')'}
            </TableCell>
            {renderLessonsFirstLine(classItem.lessons[0])}
        </TableRow>
    );
};

export const renderTeacherRangeDay = schedule => {
    if (schedule) {
        return (
            <TableContainer key={shortid.generate()}>
                <Table aria-label="sticky table">
                    <TableBody>
                        {schedule.map(classItem => {
                            return (
                                <React.Fragment key={shortid.generate()}>
                                    {renderFirstLineTable(classItem)}
                                    {renderLessonsRestLines(classItem.lessons)}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
};