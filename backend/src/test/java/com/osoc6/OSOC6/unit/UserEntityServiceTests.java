package com.osoc6.OSOC6.unit;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.dto.UserProfileDTO;
import com.osoc6.OSOC6.dto.UserRoleDTO;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.service.UserEntityService;
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
public class UserEntityServiceTests
{

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserEntityService userEntityService;

    @Test
    public void getAllUsers_ReturnsAllUsers() {
        List<UserEntity> users = List.of(new UserEntity(), new UserEntity());

        when(userRepository.findAll()).thenReturn(users);

        assertThat(userEntityService.getAllUsers()).isEqualTo(users);
    }

    @Test
    public void getExistingUser_ReturnsUser() {
        Long id = 5L;
        UserEntity user = new UserEntity("test@test.com", "tester", "test", UserRole.ADMIN, "123456");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        assertThat(userEntityService.getUser(id)).isEqualTo(user);
    }

    @Test
    public void getNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userEntityService.getUser(id));
    }

    @Test
    public void updateUserRole_ForExistingUser_ReturnsUpdatedUser() {
        Long id = 5L;
        UserEntity user = new UserEntity("test@test.com", "tester", "test", UserRole.ADMIN, "123456");
        UserRoleDTO userRoleDTO = new UserRoleDTO();
        userRoleDTO.setUserRole(UserRole.COACH);

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).then(returnsFirstArg());

        UserEntity updatedUser = userEntityService.updateUserRole(userRoleDTO, id);

        assertThat(updatedUser).isEqualTo(user);
        assertThat(updatedUser.getUserRole()).isEqualTo(userRoleDTO.getUserRole());
    }

    @Test
    public void updateUserRole_ForNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;
        UserRoleDTO userRoleDTO = new UserRoleDTO();
        userRoleDTO.setUserRole(UserRole.COACH);

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userEntityService.updateUserRole(userRoleDTO, id));
    }

    @Test
    public void updateUserProfile_ForExistingUser_ReturnsUpdatedUser() {
        Long id = 5L;
        UserEntity user = new UserEntity("test@test.com", "tester", "test", UserRole.ADMIN, "123456");
        UserProfileDTO userProfileDTO = new UserProfileDTO();
        userProfileDTO.setEmail("new@email.com");
        userProfileDTO.setFirstName("new");
        userProfileDTO.setLastName("guy");

        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).then(returnsFirstArg());

        UserEntity updatedUser = userEntityService.updateUserProfile(userProfileDTO, id);

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

        assertThrows(UserNotFoundException.class, () -> userEntityService.updateUserProfile(userProfileDTO, id));
    }

    @Test
    public void deleteExistingUser_CallsDeleteById() {
        Long id = 5L;

        when(userRepository.existsById(id)).thenReturn(true);

        userEntityService.deleteUser(id);

        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    public void deleteNonExistingUser_ThrowsUserNotFoundException() {
        Long id = 3L;

        when(userRepository.existsById(id)).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> userEntityService.deleteUser(id));
    }

}
