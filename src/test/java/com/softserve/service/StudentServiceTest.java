package com.softserve.service;

import com.softserve.dto.StudentImportDTO;
import com.softserve.entity.Group;
import com.softserve.entity.Student;
import com.softserve.entity.User;
import com.softserve.entity.enums.Role;
import com.softserve.exception.EntityNotFoundException;
import com.softserve.exception.FieldAlreadyExistsException;
import com.softserve.repository.StudentRepository;
import com.softserve.service.impl.StudentServiceImpl;
import junitparams.JUnitParamsRunner;
import junitparams.Parameters;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;
import org.springframework.mock.web.MockMultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static java.util.Collections.singletonList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@Category(UnitTestCategory.class)
@RunWith(JUnitParamsRunner.class)
public class StudentServiceTest {
    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Mock
    StudentRepository studentRepository;

    @InjectMocks
    StudentServiceImpl studentService;

    Student studentWithId1L;

    @Before
    public void setUp() {

        User userWithId1L = new User();
        userWithId1L.setId(1L);
        userWithId1L.setEmail("userWithId1L@test.com");
        userWithId1L.setPassword("12345@testAa");
        userWithId1L.setRole(Role.ROLE_STUDENT);

        studentWithId1L = new Student();
        studentWithId1L.setName("Name");
        studentWithId1L.setSurname("Surname");
        studentWithId1L.setPatronymic("Patronymic");
        studentWithId1L.setUser(userWithId1L);
    }

    @Test
    public void getAll() {
        List<Student> expected = singletonList(studentWithId1L);
        when(studentRepository.getAll()).thenReturn(expected);

        List<Student> actual = studentService.getAll();

        assertThat(actual).hasSameSizeAs(expected).hasSameElementsAs(expected);
        verify(studentRepository).getAll();
    }

    @Test
    public void getById() {
        Student expected = studentWithId1L;
        when(studentRepository.findById(expected.getId())).thenReturn(Optional.of(expected));

        Student actual = studentService.getById(expected.getId());

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).findById(expected.getId());
    }

    @Test
    public void save() {
        Student expected = studentWithId1L;
        when(studentRepository.save(expected)).thenReturn(expected);

        Student actual = studentService.save(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).save(expected);
    }

    @Test
    public void update() {
        Student expected= studentWithId1L;
        when(studentRepository.update(expected)).thenReturn(expected);

        Student actual = studentService.update(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).update(expected);
    }

    @Test
    public void delete() {
        Student expected = studentWithId1L;
        when(studentRepository.delete(expected)).thenReturn(expected);

        Student actual = studentService.delete(expected);

        assertThat(actual).isEqualToComparingFieldByField(expected);
        verify(studentRepository).delete(expected);
    }

    @Test(expected = EntityNotFoundException.class)
    public void throwEntityNotFoundExceptionWhenGetById() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());
        studentService.getById(1L);
        verify(studentRepository).findById(1L);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenSave() {
        //Доробити
        Student expected = studentWithId1L;
        studentService.save(expected);
    }

    @Test(expected = FieldAlreadyExistsException.class)
    public void throwFieldAlreadyExistsExceptionWhenUpdate() {
        //Доробити
        Student expected = studentWithId1L;
        studentService.update(expected);
    }

    @Test
    @Parameters(method = "parametersToTestImport")
    public void importStudentsFromFile(MockMultipartFile multipartFile) {

        //Null Pointer userService.findSocialUser StudentServiceImpl

        User userWithId1L = new User();
        userWithId1L.setId(1L);
        userWithId1L.setEmail("userWithId1L@test.com");
        userWithId1L.setPassword("12345@testAa");
        userWithId1L.setRole(Role.ROLE_STUDENT);
        User userWithId2L = new User();
        userWithId2L.setId(2L);
        userWithId2L.setEmail("userWithId2L@test.com");
        userWithId2L.setPassword("12345@testAa");
        userWithId2L.setRole(Role.ROLE_STUDENT);
        User userWithId3L = new User();
        userWithId3L.setId(2L);
        userWithId3L.setEmail("userWithId3L@test.com");
        userWithId3L.setPassword("12345@testAa");
        userWithId3L.setRole(Role.ROLE_STUDENT);

        List<Student> expectedStudents = new ArrayList<>();

        Group group = new Group();
        group.setId(10L);

        Student student1 = new Student();
        student1.setSurname("Romaniuk");
        student1.setName("Hanna");
        student1.setPatronymic("Stepanivna");
        student1.setUser(userWithId1L);
        student1.setGroup(group);

        Student student2 = new Student();
        student2.setSurname("Boichuk");
        student2.setName("Oleksandr");
        student2.setPatronymic("Ivanovych");
        student2.setUser(null);
        student2.setGroup(group);

        Student student3 = new Student();
        student3.setSurname("Hanushchak");
        student3.setName("Viktor");
        student3.setPatronymic("Mykolaiovych");
        student3.setUser(userWithId3L);
        student3.setGroup(group);

        expectedStudents.add(student1);
        expectedStudents.add(student2);
        expectedStudents.add(student3);

        when(studentRepository.save(student1)).thenReturn(student1);
        when(studentRepository.save(student2)).thenReturn(student2);
        when(studentRepository.save(student3)).thenReturn(student3);

        List<StudentImportDTO> actualStudents = studentService.saveFromFile(multipartFile, 4L).getNow(new ArrayList<>());
        assertNotNull(actualStudents);
        assertEquals(expectedStudents, actualStudents);
        verify(studentRepository).save(student1);
        verify(studentRepository).save(student2);
        verify(studentRepository).save(student3);
        verify(studentRepository).getExistingStudent(student1);
        verify(studentRepository).getExistingStudent(student2);
        verify(studentRepository).getExistingStudent(student3);
    }

    private Object[] parametersToTestImport() throws IOException {

        MockMultipartFile multipartFileCsv = new MockMultipartFile("file",
                "students.csv",
                "text/csv",
                Files.readAllBytes(Path.of("src/test/resources/test_students.csv")));

        MockMultipartFile multipartFileTxt = new MockMultipartFile("file",
                "students.txt",
                "text/plain",
                Files.readAllBytes(Path.of("src/test/resources/test_students.csv")));

        return new Object[] {multipartFileCsv, multipartFileTxt};
    }
}
