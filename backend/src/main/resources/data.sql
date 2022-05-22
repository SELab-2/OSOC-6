-- This file contains basic data that is loaded into the database upon startup.
INSERT INTO skill_type (colour, name) VALUES ('#1EA589', 'Front-end developer') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#B13C38', 'Back-end developer') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#C1FFAD', 'UX / UI designer') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#EC6F1C', 'Graphic designer') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#1C1CEC', 'Business Modeller') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#B88818', 'Storyteller') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#6A2A2D', 'Marketer') ON CONFLICT DO NOTHING;
INSERT INTO skill_type (colour, name) VALUES ('#1CEC1C', 'Copywriter') ON CONFLICT DO NOTHING ;
INSERT INTO skill_type (colour, name) VALUES ('#632CB1', 'Video editor') ON CONFLICT DO NOTHING ;
INSERT INTO skill_type (colour, name) VALUES ('#A73C97', 'Photographer') ON CONFLICT DO NOTHING ;
INSERT INTO skill_type (colour, name) VALUES ('#505369', 'Other') ON CONFLICT DO NOTHING;

INSERT INTO communication_template (name, subject, template)
            VALUES ('Yes', 'OSOC application status',
                    'We are pleased to tell you that you have been accepted for OSOC!\n Someone will be in touch with you shortly to work out the details.')
            ON CONFLICT DO NOTHING;
INSERT INTO communication_template (name, subject, template)
            VALUES ('No', 'OSOC application status',
                    'Unfortunately we were unable to find a fitting position for you in this edition of OSOC.\n You can always try again next year!')
            ON CONFLICT DO NOTHING;
INSERT INTO communication_template (name, subject, template)
            VALUES ('Maybe', 'OSOC application status',
                    'We might have a spot for you in the upcoming edition of OSOC, but we are still figuring some things out.\n Hold on tight!')
            ON CONFLICT DO NOTHING;
INSERT INTO communication_template (name, subject, template)
            VALUES ('Invite', 'OSOC selection tool invitation',
                    'This is an invite for the OSOC selection tool. Please use the link provided below to register.')
            ON CONFLICT DO NOTHING;
