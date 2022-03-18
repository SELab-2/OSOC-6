package com.osoc6.OSOC6.unit;

import com.osoc6.OSOC6.database.models.User;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.dto.UserProfileDTO;
import com.osoc6.OSOC6.dto.UserRoleDTO;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void getAllUsers_ReturnsAllUsers() {
        List<User> users = List.of(new User(), new User());

        when(userRepository.findAll()).thenReturn(users);

        assertThat(userService.getAllUsers()).isEqualTo(users);
    }

    @Test
    public void getExistingUser_ReturnsUser() {
        Long id = 5L;
        User user = new User("test@test.com", "tester", "test", UserRole.ADMIN);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        assertThat(userService.getUser(id)).isEqualTo(user);
    }

    @Test
    public void getNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUser(id));
    }

    @Test
    public void updateUserRole_ForExistingUser_ReturnsUpdatedUser() {
        Long id = 5L;
        User user = new User("test@test.com", "tester", "test", UserRole.ADMIN);
        UserRoleDTO userRoleDTO = new UserRoleDTO();
        userRoleDTO.setUserRole(UserRole.COACH);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).then(returnsFirstArg());

        User updatedUser = userService.updateUserRole(userRoleDTO, id);

        assertThat(updatedUser).isEqualTo(user);
        assertThat(updatedUser.getUserRole()).isEqualTo(userRoleDTO.getUserRole());
    }

    @Test
    public void updateUserRole_ForNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;
        UserRoleDTO userRoleDTO = new UserRoleDTO();
        userRoleDTO.setUserRole(UserRole.COACH);

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUserRole(userRoleDTO, id));
    }

    @Test
    public void updateUserProfile_ForExistingUser_ReturnsUpdatedUser() {
        Long id = 5L;
        User user = new User("test@test.com", "tester", "test", UserRole.ADMIN);
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setEmail("new@email.com");
        userProfileDTO.setFirstName("new");
        userProfileDTO.setLastName("guy");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).then(returnsFirstArg());

        User updatedUser = userService.updateUserProfile(userProfileDTO, id);

        assertThat(updatedUser).isEqualTo(user);
        assertThat(updatedUser.getEmail()).isEqualTo(userProfileDTO.getEmail());
        assertThat(updatedUser.getFirstName()).isEqualTo(userProfileDTO.getFirstName());
        assertThat(updatedUser.getLastName()).isEqualTo(userProfileDTO.getLastName());
    }

    @Test
    public void updateUserProfile_ForNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setEmail("new@email.com");
        userProfileDTO.setFirstName("new");
        userProfileDTO.setLastName("guy");

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.updateUserProfile(userProfileDTO, id));
    }

    @Test
    public void deleteExistingUser_CallsDeleteById() {
        Long id = 5L;

        when(userRepository.existsById(id)).thenReturn(true);

        userService.deleteUser(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    public void deleteNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;

        when(userRepository.existsById(id)).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(id));
    }

}
