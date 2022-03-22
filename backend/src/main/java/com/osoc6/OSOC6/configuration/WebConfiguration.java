package com.osoc6.OSOC6.configuration;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * The configuration of the application.
 * This class wil load and set up anything non-default needed to run the application.
 */
@Configuration
public class WebConfiguration {

    /**
     * Get the message source application.properties file containing all the validation messages.
     * @return the message source
     */
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:validation-messages");
        return messageSource;
    }

    /**
     * Set up the LocalValidatorFactoryBean to use messages from the specified message source.
     * @return the configured LocalValidatorFactoryBean
     */
    @Bean
    public LocalValidatorFactoryBean getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource());
        return bean;
    }
}
