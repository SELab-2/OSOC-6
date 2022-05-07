package com.osoc6.OSOC6.mail;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
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
     * The content of the password reset mail.
     */
    private static final String RESET_PASSWORD_TEXT = """
            Use the link below to reset your password.
            Please note that the link is only valid for %s hours after the request.
            %s
            """;

    /**
     * Send a password reset mail.
     * @param to the email to send the mail to
     * @param token the password reset token
     */
    public void sendResetPasswordMessage(final String to, final String token) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("noreply@selab2.osoc6.com");
        mailMessage.setTo(to);
        mailMessage.setSubject("Reset password - OSOC selection tool");
        mailMessage.setText(String.format(RESET_PASSWORD_TEXT,
                RadagastNumberWizard.PASSWORD_TOKEN_EXPIRATION_HOURS,
                "http://" + baseDomain + "/api/reset-password?token=" + token));

        emailSender.send(mailMessage);
    }
}
