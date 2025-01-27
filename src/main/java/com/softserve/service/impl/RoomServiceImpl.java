package com.softserve.service.impl;

import com.softserve.dto.RoomForScheduleInfoDTO;
import com.softserve.entity.Room;
import com.softserve.entity.enums.EvenOdd;
import com.softserve.exception.EntityAlreadyExistsException;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.SortOrderNotExistsException;
import com.softserve.mapper.RoomForScheduleInfoMapper;
import com.softserve.repository.RoomRepository;
import com.softserve.service.RoomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;

@Transactional
@Service
@Slf4j
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomForScheduleInfoMapper roomForScheduleInfoMapper;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, RoomForScheduleInfoMapper roomForScheduleInfoMapper) {
        this.roomRepository = roomRepository;
        this.roomForScheduleInfoMapper = roomForScheduleInfoMapper;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room getById(Long id) {
        log.info("Enter into getById of RoomServiceImpl with id {}", id);
        return roomRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(Room.class, "id", id.toString())
        );
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAll() {
        log.info("Enter into getAll of RoomServiceImpl");
        return roomRepository.getAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getDisabled() {
        log.info("Enter into getAll of getDisabled");
        return roomRepository.getDisabled();
    }

    /**
     * {@inheritDoc}
     *
     * @throws EntityAlreadyExistsException if given room already exists
     */
    @Override
    public Room save(Room object) {
        log.info("Enter into save of RoomServiceImpl with entity:{}", object);
        if (isRoomExists(object)) {
            throw new EntityAlreadyExistsException("Room with this parameters already exists");
        } else {
            object.setSortOrder(roomRepository.getLastSortOrder().orElse(0) + 1);
            return roomRepository.save(object);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @throws EntityAlreadyExistsException if there is already another room with parameters as in the given room
     */
    @Override
    public Room update(Room object) {
        log.info("Enter into update of RoomServiceImpl with entity:{}", object);
        if (isRoomExists(object)) {
            throw new EntityAlreadyExistsException("Room with this parameters already exists");
        } else {
            object.setSortOrder(getSortOrderById(object.getId()));
            return roomRepository.update(object);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room delete(Room object) {
        log.info("Enter into delete of RoomServiceImpl with entity:{}", object);
        Room deleted = roomRepository.delete(object);
        roomRepository.shiftSortOrderRange(deleted.getSortOrder() + 1, null, RoomRepository.Direction.UP);
        return deleted;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> freeRoomBySpecificPeriod(Long idOfPeriod, DayOfWeek dayOfWeek, EvenOdd evenOdd) {
        log.info("Enter into freeRoomBySpecificPeriod of RoomServiceImpl with id {}, dayOfWeek {} and evenOdd {} ",
                idOfPeriod, dayOfWeek, evenOdd);
        return roomRepository.freeRoomBySpecificPeriod(idOfPeriod, dayOfWeek, evenOdd);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getNotAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        return roomRepository.getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAvailableRoomsForSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        return roomRepository.getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<RoomForScheduleInfoDTO> getAllRoomsForCreatingSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId) {
        List<RoomForScheduleInfoDTO> rooms = roomForScheduleInfoMapper.toRoomForScheduleDTOList(
                getAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId));
        rooms.forEach(roomForScheduleDTO -> roomForScheduleDTO.setAvailable(true));
        rooms.addAll(roomForScheduleInfoMapper.toRoomForScheduleDTOList(getNotAvailableRoomsForSchedule(semesterId, dayOfWeek, evenOdd, classId)));
        return rooms;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean isRoomExists(Room room) {
        return roomRepository.countRoomDuplicates(room) != 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Room> getAllOrdered() {
        log.info("Entered getAllOrdered()");
        return roomRepository.getAllOrdered();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room saveAfterId(Room room, Long afterId) {
        log.trace("Entered saveAfterId({},{})", room, afterId);
        int order;
        if (afterId.equals(0L)) {
            order = 1;
        } else {
            order = getSortOrderById(afterId) + 1;
        }
        roomRepository.shiftSortOrderRange(order, null, RoomRepository.Direction.DOWN);
        room.setSortOrder(order);
        return roomRepository.save(room);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Room updateSortOrder(Room room, Long afterId) {
        log.trace("Entered updateSortOrder({}, {})", room, afterId);
        if (room.getId().equals(afterId)) {
            return room;
        }
        if (!roomRepository.exists(room.getId())) {
            throw new EntityNotFoundException(Room.class, "id", room.getId().toString());
        }
        if (afterId.equals(0L)) {
            roomRepository.shiftSortOrderRange(1, null, RoomRepository.Direction.DOWN);
            room.setSortOrder(1);
        } else {
            room.setSortOrder(getSortOrderById(room.getId()));
            Integer sortOrderOfPrevRoom = getSortOrderById(afterId);
            if (sortOrderOfPrevRoom > room.getSortOrder()) {
                roomRepository.shiftSortOrderRange(room.getSortOrder() + 1, sortOrderOfPrevRoom, RoomRepository.Direction.UP);
                room.setSortOrder(sortOrderOfPrevRoom);
            } else {
                roomRepository.shiftSortOrderRange(sortOrderOfPrevRoom + 1, room.getSortOrder(), RoomRepository.Direction.DOWN);
                room.setSortOrder(sortOrderOfPrevRoom + 1);
            }
        }
        return roomRepository.update(room);
    }

    /**
     * Retrieves sort order by room id.
     *
     * @param id the id of the room
     * @return the sort order of the given room id
     * @throws SortOrderNotExistsException if sort order of the room isn't set
     */
    private Integer getSortOrderById(Long id) {
        log.trace("Entered getSortOrderById({})", id);
        return roomRepository.getSortOrderById(id)
                .orElseThrow(() -> new SortOrderNotExistsException(Room.class, id));
    }
}
