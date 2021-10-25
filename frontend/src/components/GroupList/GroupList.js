import '../../router/Router.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { dialogTypes } from '../../constants/dialogs';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';
import { goToGroupPage } from '../../helper/pageRedirection';
import { search } from '../../helper/search';
import GroupCard from '../GroupCard/GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import {
    ShowStudentsOnGroupDialog,
    AddStudentDialog,
    CustomDialog,
} from '../../share/DialogWindows';
import {
    getAllStudentsByGroupId,
    createStudentService,
    deleteStudentService,
    updateStudentService,
} from '../../services/studentService';

const GroupList = (props) => {
    const {
        startFetchDisabledGroups,
        startFetchEnabledGroups,
        startDeleteGroup,
        startToggleGroup,
        disabledGroups,
        enabledGroups,
        selectGroup,
        students,
        loading,
        student,
        match,
        term,
        isDisabled,
    } = props;
    const history = useHistory();
    const { t } = useTranslation('formElements');
    
    const [group, setGroup] = useState();
    const [groupId, setGroupId] = useState(-1);
    const [subDialogType, setSubDialogType] = useState('');
    const [showStudents, setShowStudents] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [openAddStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => {
        startFetchEnabledGroups();
    }, []);
    useEffect(() => {
        startFetchDisabledGroups();
    }, [isDisabled]);

    const visibleGroups = isDisabled
        ? search(disabledGroups, term, ['title'])
        : search(enabledGroups, term, ['title']);

    const changeGroupDisabledStatus = (currentGroupId) => {
        const disabledGroup = disabledGroups.find((groupItem) => groupItem.id === currentGroupId);
        const enabledGroup = enabledGroups.find((groupItem) => groupItem.id === currentGroupId);
        startToggleGroup(enabledGroup, disabledGroup);
    };
    const showCustomDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setSubDialogType(disabledStatus);
        setOpenSubDialog(true);
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenSubDialog(false);
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGroupDisabledStatus(currentGroupId);
        } else startDeleteGroup(currentGroupId);
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setAddStudentDialog(true);
    };

    const showStudentsByGroup = (currentGroup) => {
        setGroup(currentGroup);
        getAllStudentsByGroupId(currentGroup.id);
        setShowStudents(true);
    };

    const studentSubmit = (data) => {
        if (data.id !== undefined) {
            const sendData = { ...data, group: { id: data.group } };
            updateStudentService(sendData);
        } else {
            const sendData = { ...data, group: { id: groupId } };
            createStudentService(sendData);
        }
        setAddStudentDialog(false);
        goToGroupPage(history);
    };

    return (
        <>
            <CustomDialog
                type={subDialogType}
                cardId={groupId}
                whatDelete="group"
                open={openSubDialog}
                onClose={acceptConfirmDialog}
                setOpenSubDialog={setOpenSubDialog}
            />
            <AddStudentDialog
                onSubmit={studentSubmit}
                open={openAddStudentDialog}
                onSetSelectedCard={() => setAddStudentDialog(false)}
            />
            {showStudents && (
                <ShowStudentsOnGroupDialog
                    onClose={() => setShowStudents(false)}
                    open={showStudents}
                    students={students}
                    group={group}
                    onDeleteStudent={(studentItem) => deleteStudentService(studentItem)}
                    onSubmit={studentSubmit}
                    match={match}
                    student={student}
                    groups={enabledGroups}
                />
            )}
            <div className="group-wrapper group-list">
                {loading && (
                    <section className="centered-container">
                        <CircularProgress />
                    </section>
                )}
                {!loading && visibleGroups.length === 0 ? (
                    <NotFound name={t(GROUP_Y_LABEL)} />
                ) : (
                    visibleGroups.map((item) => (
                        <GroupCard
                            key={item.id}
                            item={item}
                            disabled={isDisabled}
                            showCustomDialog={showCustomDialog}
                            getGroupToUpdateForm={(id) => selectGroup(id)}
                            showAddStudentDialog={showAddStudentDialog}
                            showStudentsByGroup={showStudentsByGroup}
                        />
                    ))
                )}
            </div>
        </>
    );
};

export default GroupList;
