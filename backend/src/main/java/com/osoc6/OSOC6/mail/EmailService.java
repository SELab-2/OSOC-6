package com.osoc6.OSOC6.mail;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import com.osoc6.OSOC6.winterhold.VengerbergMailWizard;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * This component is used for sending emails from the mail account configured in application.properties.
 */
@Component
@RequiredArgsConstructor
public class EmailService {

    /**
     * The Java mail sender, used to send emails.
     */
    private final JavaMailSender emailSender;

    /**
     * The base domain of the website.
     */
    @Value("${domain}")
    private String baseDomain;

    /**
     * Send a password reset mail.
     * @param to the email to send the mail to
     * @param token the password reset token
     */
    public void sendResetPasswordMessage(final String to, final String token) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(VengerbergMailWizard.FROM_MAIL_ADDRESS);
        mailMessage.setTo(to);
        mailMessage.setSubject(VengerbergMailWizard.RESET_PASSWORD_SUBJECT);
        mailMessage.setText(String.format(VengerbergMailWizard.RESET_PASSWORD_TEXT,
                RadagastNumberWizard.PASSWORD_TOKEN_EXPIRATION_HOURS,
                "http://" + baseDomain + "/api/reset-password?token=" + token));

        emailSender.send(mailMessage);
    }
}
